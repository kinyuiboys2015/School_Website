import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import nodemailer from "nodemailer";
import cloudinary from "../../../libs/cloudinary";
import { v4 as uuidv4 } from "uuid";

// ==================== TOKEN VERIFICATION FOR POST ONLY ====================
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
    try {
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'TEACHER', 'HR_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to send email campaigns' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Email campaign authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole
        },
        deviceInfo: deviceValid.payload
      };

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { 
        valid: false, 
        reason: 'validation_error', 
        message: 'Authentication validation failed',
        error: error.message 
      };
    }
  }

  static validateDeviceToken(token) {
    try {
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      if (createdAt < thirtyDaysAgo) {
        return { valid: false, reason: 'age_expired', payload, error: 'Device token is too old' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: 'invalid_format', error: error.message };
    }
  }
}

const authenticateRequest = (req) => {
  const headers = req.headers;
  
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to send email campaigns.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.devInfo
  };
};
// ==================== END TOKEN VERIFICATION ====================

// ====================================================================
// CONFIGURATION
// ====================================================================
const isProduction = process.env.NODE_ENV === 'production';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
  rateDelta: 2000,
  rateLimit: 5,
});

// School Information
const SCHOOL_NAME = process.env.SCHOOL_NAME || 'kinyui boys Senior School';
const SCHOOL_LOCATION = process.env.SCHOOL_LOCATION || 'Matungulu, Machakos County';
const SCHOOL_MOTTO = process.env.SCHOOL_MOTTO || 'Soaring to Excellence';
const CONTACT_PHONE = process.env.CONTACT_PHONE || '+254720123456';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ||'kinyuiboys2015@gmail.com';
const SCHOOL_WEBSITE = process.env.SCHOOL_WEBSITE || 'https://kinyui-senior.vercel.app';

// Social Media Configuration
const SOCIAL_MEDIA = {
  facebook: {
    url: process.env.SCHOOL_FACEBOOK || 'https://web.facebook.com/groups/414008468611340',
    color: '#1877F2',
  },
  youtube: {
    url: process.env.SCHOOL_YOUTUBE || 'https://www.youtube.com/@SA.-kinyui boys-HIGH-SCHOOOL',
    color: '#FF0000',
  },
  linkedin: {
    url: process.env.SCHOOL_LINKEDIN || 'https://www.linkedin.com/in/kinyui boys-senior-school-8662113b7/',
    color: '#0A66C2',
  },
  twitter: {
    url: process.env.SCHOOL_TWITTER || 'https://twitter.com/kinyui boysschool',
    color: '#1DA1F2',
  }
};

// ====================================================================
// CLOUDINARY HELPER FUNCTIONS
// ====================================================================

// Helper: Upload file to Cloudinary
const uploadFileToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const fileExtension = originalName.substring(originalName.lastIndexOf('.'));
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}-${sanitizedFileName}`;
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // "auto" for any file type
          folder: "school/email-campaigns/attachments",
          public_id: uniqueFileName,
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    return {
      filename: result.public_id,
      originalName: originalName,
      fileType: fileExtension.substring(1), // Remove dot from extension
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      storageType: 'cloudinary'
    };
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};

// Helper: Delete file from Cloudinary
const deleteFileFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Error deleting file from Cloudinary:", error);
  }
};

// Helper to delete files from Cloudinary based on attachments data
const deleteCloudinaryFiles = async (attachments) => {
  if (!attachments || !Array.isArray(attachments)) return;

  try {
    const deletePromises = attachments
      .filter(attachment => attachment.storageType === 'cloudinary' && attachment.publicId)
      .map(attachment => deleteFileFromCloudinary(attachment.publicId));
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("❌ Error deleting Cloudinary files:", error);
  }
};

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

function getRecipientTypeLabel(type) {
  const labels = {
    'all': 'All Recipients',
    'parents': 'Parents & Guardians',
    'teachers': 'Teaching Staff',
    'administration': 'Administration',
    'bom': 'Board of Management',
    'support': 'Support Staff',
    'staff': 'All School Staff'
  };
  return labels[type] || type;
}

function sanitizeContent(content) {
  // Reduce font-size styles
  let safeContent = content
    .replace(/font-size\s*:\s*[^;]+;/gi, '')
    .replace(/<font[^>]*>/gi, '')
    .replace(/<\/font>/gi, '')
    .replace(/size\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
  
  // Convert newlines to <br> tags
  safeContent = safeContent.replace(/\n/g, '<br>');
  
  // Remove extra font styles
  safeContent = safeContent.replace(/style\s*=\s*["'][^"']*font[^"']*["']/gi, '');

  return safeContent;
}

function getModernEmailTemplate({ 
  subject = '', 
  content = '',
  senderName = 'School Administration',
  recipientType = 'all',
  attachments = []
}) {
  const recipientTypeLabel = getRecipientTypeLabel(recipientType);
  const sanitizedContent = sanitizeContent(content);
  
  // Generate attachments HTML if there are attachments
  const attachmentsHTML = attachments && attachments.length > 0 ? `
    <tr>
      <td style="padding: 0 6% 6%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #64748b;">
          <tr>
            <td style="padding: 5%;">
              <p style="color: #0f172a; font-size: clamp(14px, 3.5vw, 15px); font-weight: 700; margin: 0 0 12px;">📎 Attachments</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${attachments.map(attachment => `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <a href="${attachment.url}" target="_blank" style="color: #334155; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600; text-decoration: none;">${attachment.originalName || attachment.filename}</a>
                      <span style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin-left: 6px;">(${formatFileSize(attachment.fileSize)})</span>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  ` : '';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>${subject}</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; line-height: 1.6; color: #1e293b; -webkit-text-size-adjust: 100%;">
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f1f5f9;">
      <tr>
        <td align="center" style="padding: 4% 3%;">
          
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15,23,42,0.08);">
            
            <!-- HEADER -->
            <tr>
              <td style="background: linear-gradient(135deg, #0f172a 0%, #334155 100%); padding: 10% 6% 8%; text-align: center;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding-bottom: 10px;">
                      <div style="display: inline-block; background: rgba(255,255,255,0.1); border-radius: 50%; width: 52px; height: 52px; line-height: 52px; text-align: center;">
                        <span style="font-size: 26px;">📨</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <h1 style="color: white; font-size: clamp(20px, 5.5vw, 26px); font-weight: 800; margin: 0 0 6px; line-height: 1.2; letter-spacing: -0.02em;">${SCHOOL_NAME}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 8px;">
                      <span style="display: inline-block; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); padding: 5px 16px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.9);">${recipientTypeLabel}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- SUBJECT & DATE -->
            <tr>
              <td style="padding: 8% 6% 2%;">
                <h2 style="color: #0f172a; font-size: clamp(18px, 4.8vw, 24px); font-weight: 700; margin: 0 0 8px; line-height: 1.3; letter-spacing: -0.01em;">${subject}</h2>
                <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin: 0; letter-spacing: 0.03em;">
                  ${new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                  })}
                </p>
              </td>
            </tr>
            
            <!-- DIVIDER -->
            <tr>
              <td style="padding: 4% 6%;">
                <div style="height: 1px; background: #e2e8f0;"></div>
              </td>
            </tr>
            
            <!-- MESSAGE CONTENT -->
            <tr>
              <td style="padding: 0 6% 6%;">
                <div style="color: #334155; font-size: clamp(14px, 3.5vw, 15px); line-height: 1.7;">
                  ${sanitizedContent}
                </div>
              </td>
            </tr>
            
            <!-- ATTACHMENTS -->
            ${attachmentsHTML}
            
            <!-- NOTICE -->
            <tr>
              <td style="padding: 0 6% 6%;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <tr>
                    <td style="padding: 4%; text-align: center;">
                      <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin: 0; font-style: italic;">
                        Official communication from ${SCHOOL_NAME}. Do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- FOOTER -->
            <tr>
              <td style="background: #0f172a; padding: 8% 6%; text-align: center;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center">
                      <p style="color: #ffffff; font-size: clamp(15px, 4vw, 17px); font-weight: 700; margin: 0 0 4px; letter-spacing: -0.01em;">${SCHOOL_NAME}</p>
                      <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 14px;">${SCHOOL_LOCATION}</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom: 14px;">
                      <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">
                        <a href="mailto:${CONTACT_EMAIL}" style="color: #94a3b8; text-decoration: none;">${CONTACT_EMAIL}</a>
                      </p>
                      <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">
                        <a href="tel:${CONTACT_PHONE}" style="color: #94a3b8; text-decoration: none;">${CONTACT_PHONE}</a>
                      </p>
                      <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0;">
                        <a href="${SCHOOL_WEBSITE}" target="_blank" style="color: #94a3b8; text-decoration: none;">${SCHOOL_WEBSITE}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom: 14px;">
                      <p style="color: #64748b; font-size: clamp(11px, 2.8vw, 12px); font-weight: 600; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.06em;">Follow Us</p>
                      <p style="margin: 0; font-size: clamp(12px, 3vw, 13px);">
                        <a href="${SOCIAL_MEDIA.facebook.url}" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 4px;">Facebook</a>
                        <span style="color: #475569;">·</span>
                        <a href="${SOCIAL_MEDIA.youtube.url}" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 4px;">YouTube</a>
                        <span style="color: #475569;">·</span>
                        <a href="${SOCIAL_MEDIA.linkedin.url}" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 4px;">LinkedIn</a>
                        <span style="color: #475569;">·</span>
                        <a href="${SOCIAL_MEDIA.twitter.url}" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 4px;">Twitter</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <div style="width: 40px; height: 2px; background: #475569; margin: 0 auto 12px;"></div>
                      <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">Sent by: ${senderName}</p>
                      <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">Confidential communication for authorized recipients only.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
</body>
</html>`;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function sendModernEmails(campaign) {
  const startTime = Date.now();
  
  const recipients = campaign.recipients.split(",").map(r => r.trim());
  const recipientType = campaign.recipientType || 'all';
  
  const sentRecipients = [];
  const failedRecipients = [];
  
  // Parse attachments
  let attachmentsArray = [];
  try {
    if (campaign.attachments) {
      attachmentsArray = Array.isArray(campaign.attachments) ? 
        campaign.attachments : 
        JSON.parse(campaign.attachments);
    }
  } catch (error) {
    console.error('Error parsing attachments:', error);
  }
  
  // Prepare email attachments for nodemailer (Cloudinary URLs as links, not attachments)
  const emailAttachments = attachmentsArray.map(attachment => {
    return {
      filename: attachment.originalName || attachment.filename,
      path: attachment.url,
      contentType: getContentType(attachment.fileType)
    };
  });

  // Optimized sequential processing
  for (const recipient of recipients) {
    try {
      // Generate email content with attachments section
      const htmlContent = getModernEmailTemplate({
        subject: campaign.subject,
        content: campaign.content,
        senderName: 'School Administration',
        recipientType: recipientType,
        attachments: attachmentsArray
      });

      const mailOptions = {
        from: `"${SCHOOL_NAME} Administration" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: `${campaign.subject} • ${SCHOOL_NAME}`,
        html: htmlContent,
        text: campaign.content.replace(/<[^>]*>/g, ''),
        attachments: emailAttachments,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'senior',
          'Importance': 'senior'
        }
      };

      const info = await transporter.sendMail(mailOptions);
      
      sentRecipients.push({
        email: recipient,
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      });

      // Small delay between emails to prevent rate limiting
      if (sentRecipients.length % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      failedRecipients.push({ 
        recipient, 
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
      
      // If we get a timeout error, wait a bit before continuing
      if (error.message.includes('Timeout') || error.code === 'ETIMEDOUT') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  try {
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { 
        sentAt: new Date(),
        sentCount: sentRecipients.length,
        failedCount: failedRecipients.length,
        status: 'published',
      },
    });
  } catch (dbError) {
    console.error(`Failed to update campaign statistics:`, dbError);
  }

  const processingTime = Date.now() - startTime;
  const summary = {
    total: recipients.length,
    successful: sentRecipients.length,
    failed: failedRecipients.length,
    successRate: recipients.length > 0 ? Math.round((sentRecipients.length / recipients.length) * 100) : 0,
    processingTime: `${processingTime}ms`
  };

  return { 
    sentRecipients, 
    failedRecipients,
    summary
  };
}

function getContentType(fileType) {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };
  
  return mimeTypes[fileType.toLowerCase()] || 'application/octet-stream';
}

// Helper to validate email addresses
function validateEmailList(emailList) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmails = [];
  const invalidEmails = [];
  
  emailList.forEach(email => {
    if (emailRegex.test(email.trim())) {
      validEmails.push(email.trim());
    } else {
      invalidEmails.push(email);
    }
  });
  
  return { validEmails, invalidEmails };
}

// Helper to save uploaded file to Cloudinary
async function saveUploadedFile(file) {
  if (!file || file.size === 0) return null;
  
  // Validate file size (max 20MB for Cloudinary)
  const maxSize = 20 * 1024 * 1024; // 20MB (Cloudinary supports up to 100MB)
  if (file.size > maxSize) {
    throw new Error(`File ${file.name} is too large. Maximum size is 20MB.`);
  }
  
  // Upload to Cloudinary
  const cloudinaryResult = await uploadFileToCloudinary(file);
  
  if (!cloudinaryResult) {
    throw new Error(`Failed to upload file ${file.name} to Cloudinary`);
  }
  
  return cloudinaryResult;
}

// Validate attachment size before saving
function validateAttachmentSize(attachmentsArray) {
  const MAX_ATTACHMENTS_SIZE = 50000; // 50KB max for metadata
  
  const jsonString = JSON.stringify(attachmentsArray);
  if (jsonString.length > MAX_ATTACHMENTS_SIZE) {
    throw new Error(`Attachments metadata is too large (${jsonString.length} bytes). Maximum allowed is ${MAX_ATTACHMENTS_SIZE} bytes.`);
  }
  return true;
}

// ====================================================================
// API HANDLERS - POST AND GET ONLY
// ====================================================================

// 🔹 POST - Create a new email campaign with FormData (PROTECTED)
export async function POST(req) {
  try {
    // ==================== ADD AUTHENTICATION HERE ====================
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("📧 POST /api/email-campaigns - Creating email campaign");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    // ==================== END AUTHENTICATION ====================

    let campaign = null;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData with file uploads
      const formData = await req.formData();
      
      // Extract text fields
      const title = formData.get('title')?.toString() || '';
      const subject = formData.get('subject')?.toString() || '';
      const content = formData.get('content')?.toString() || '';
      const recipients = formData.get('recipients')?.toString() || '';
      const status = formData.get('status')?.toString() || 'draft';
      const recipientType = formData.get('recipientType')?.toString() || 'all';
      const existingAttachmentsJson = formData.get('existingAttachments')?.toString();
      
      // Parse existing attachments if provided
      let existingAttachments = [];
      if (existingAttachmentsJson) {
        try {
          existingAttachments = JSON.parse(existingAttachmentsJson);
        } catch (error) {
          console.error('Error parsing existing attachments:', error);
        }
      }
      
      // Process new file uploads
      const newAttachments = [];
      const attachmentFiles = formData.getAll('attachments');
      
      for (const file of attachmentFiles) {
        if (file && file.size > 0) {
          const savedFile = await saveUploadedFile(file);
          if (savedFile) {
            newAttachments.push(savedFile);
          }
        }
      }
      
      // Combine existing and new attachments
      const allAttachments = [...existingAttachments, ...newAttachments];
      
      // Validate attachment size
      if (allAttachments.length > 0) {
        validateAttachmentSize(allAttachments);
      }
      
      // Validate required fields
      if (!title || !subject || !content || !recipients) {
        return NextResponse.json({ 
          success: false, 
          error: "All fields are required: title, subject, content, and recipients" 
        }, { status: 400 });
      }
      
      // Validate content length
      const MAX_CONTENT_LENGTH = 65535;
      if (content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json({ 
          success: false, 
          error: `Content is too long. Maximum ${MAX_CONTENT_LENGTH} characters allowed.`,
          currentLength: content.length
        }, { status: 400 });
      }
      
      // Validate recipients
      const emailList = recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
      if (emailList.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: "At least one valid email address is required" 
        }, { status: 400 });
      }
      
      const { validEmails, invalidEmails } = validateEmailList(emailList);
      if (invalidEmails.length > 0) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid email addresses detected",
          invalidEmails 
        }, { status: 400 });
      }
      
      // Deduplicate emails
      const uniqueEmails = [...new Set(validEmails)];
      
      // Optimize attachment data to reduce size
      const optimizedAttachments = allAttachments.map(attachment => ({
        filename: attachment.filename,
        originalName: attachment.originalName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        uploadedAt: attachment.uploadedAt,
        url: attachment.url,
        publicId: attachment.publicId,
        storageType: attachment.storageType || 'cloudinary'
      }));
      
      // Create campaign in database with audit trail
      campaign = await prisma.emailCampaign.create({
        data: { 
          title, 
          subject, 
          content, 
          recipients: uniqueEmails.join(', '),
          recipientType,
          status,
          attachments: optimizedAttachments.length > 0 ? JSON.stringify(optimizedAttachments) : null,
          ...(status === 'published' && { sentAt: new Date() })
        },
      });
      
      let emailResults = null;
      
      // Send emails immediately if published
      if (status === "published") {
        try {
          emailResults = await sendModernEmails(campaign);
          
          // Update campaign with email results
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { 
              sentCount: emailResults.summary.successful,
              failedCount: emailResults.summary.failed
            },
          });
        } catch (emailError) {
          console.error(`Email sending failed:`, emailError);
          
          // Update campaign to reflect failure
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { 
              failedCount: uniqueEmails.length,
              status: 'draft',
            },
          });
          
          emailResults = {
            error: emailError.message,
            sentRecipients: [],
            failedRecipients: uniqueEmails.map(email => ({ 
              recipient: email, 
              error: emailError.message 
            })),
            summary: {
              total: uniqueEmails.length,
              successful: 0,
              failed: uniqueEmails.length,
              successRate: 0
            }
          };
        }
      }
      
      // Format response
      const responseData = {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content,
        recipients: campaign.recipients,
        recipientCount: uniqueEmails.length,
        recipientType: campaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(campaign.recipientType || 'all'),
        status: campaign.status,
        sentAt: campaign.sentAt,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        attachments: optimizedAttachments,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      };
      
      const response = {
        success: true, 
        campaign: responseData,
        emailResults,
        message: status === "published" 
          ? `Campaign created and ${emailResults?.summary?.successful || 0} emails sent successfully` 
          : `Campaign saved as draft successfully`
      };
      
      return NextResponse.json(response, { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
    } else {
      // Handle JSON request (for backwards compatibility)
      const { title, subject, content, recipients, status = "draft", recipientType = "all", attachments = null } = await req.json();
      
      // Validate required fields
      if (!title || !subject || !content || !recipients) {
        return NextResponse.json({ 
          success: false, 
          error: "All fields are required: title, subject, content, and recipients" 
        }, { status: 400 });
      }
      
      // Validate content length
      const MAX_CONTENT_LENGTH = 65535;
      if (content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json({ 
          success: false, 
          error: `Content is too long. Maximum ${MAX_CONTENT_LENGTH} characters allowed.`,
          currentLength: content.length
        }, { status: 400 });
      }
      
      // Validate recipients format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailList = recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
      
      if (emailList.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: "At least one valid email address is required" 
        }, { status: 400 });
      }
      
      const invalidEmails = emailList.filter(email => !emailRegex.test(email));
      
      if (invalidEmails.length > 0) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid email addresses detected",
          invalidEmails 
        }, { status: 400 });
      }
      
      // Deduplicate emails
      const uniqueEmails = [...new Set(emailList)];
      
      // Create campaign in database with audit trail
      campaign = await prisma.emailCampaign.create({
        data: { 
          title, 
          subject, 
          content, 
          recipients: uniqueEmails.join(', '),
          recipientType,
          status: status || "draft",
          attachments: attachments,
        },
      });
      
      let emailResults = null;
      
      // Send emails immediately if published
      if (status === "published") {
        try {
          emailResults = await sendModernEmails(campaign);
        } catch (emailError) {
          console.error(`Email sending failed:`, emailError);
          
          // Update campaign to reflect failure
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { 
              failedCount: uniqueEmails.length,
              status: 'draft',
            },
          });
          
          emailResults = {
            error: emailError.message,
            sentRecipients: [],
            failedRecipients: uniqueEmails.map(email => ({ 
              recipient: email, 
              error: emailError.message 
            })),
            summary: {
              total: uniqueEmails.length,
              successful: 0,
              failed: uniqueEmails.length,
              successRate: 0
            }
          };
        }
      }
      
      // Format response
      const responseData = {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content.substring(0, 200) + (campaign.content.length > 200 ? '...' : ''),
        recipients: campaign.recipients,
        recipientCount: uniqueEmails.length,
        recipientType: campaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(campaign.recipientType || 'all'),
        status: campaign.status,
        sentAt: campaign.sentAt,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        attachments: campaign.attachments ? JSON.parse(campaign.attachments) : [],
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      };
      
      const response = {
        success: true, 
        campaign: responseData,
        emailResults,
        message: status === "published" 
          ? `Campaign created and ${emailResults?.summary?.successful || 0} emails sent successfully` 
          : `Campaign saved as draft successfully`
      };
      
      return NextResponse.json(response, { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }
    
  } catch (error) {
    console.error(`POST Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to create campaign";
    
    if (error.code === 'P2000') {
      statusCode = 400;
      errorMessage = "Data too long for database column. Please shorten your content or attachments metadata.";
    } else if (error.code === 'P2002') {
      statusCode = 409;
      errorMessage = "A campaign with similar data already exists";
    } else if (error.code === 'P2021' || error.code === 'P1001') {
      errorMessage = "Database connection error. Please try again later.";
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: error.message
    }, { status: statusCode });
  }
}

// 🔹 GET - Get all campaigns with filtering and pagination (PUBLIC)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Build filter conditions
    const where = {};
    
    if (searchParams.has('status')) {
      where.status = searchParams.get('status');
    }
    
    if (searchParams.has('recipientType')) {
      where.recipientType = searchParams.get('recipientType');
    }
    
    if (searchParams.has('search')) {
      const searchTerm = searchParams.get('search');
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { subject: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;
    
    // Get total count and campaigns
    const [totalCount, campaigns] = await Promise.all([
      prisma.emailCampaign.count({ where }),
      prisma.emailCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          subject: true,
          content: true,
          recipients: true,
          recipientType: true,
          status: true,
          sentAt: true,
          sentCount: true,
          failedCount: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
        }
      })
    ]);
    
    // Format response
    const formattedCampaigns = campaigns.map(campaign => {
      const recipientCount = campaign.recipients.split(',').length;
      const recipientType = campaign.recipientType || 'all';
      
      // Parse attachments
      let attachments = [];
      try {
        if (campaign.attachments) {
          attachments = JSON.parse(campaign.attachments);
        }
      } catch (error) {
        console.error('Error parsing attachments:', error);
      }
      
      return {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content.length > 500 
          ? campaign.content.substring(0, 500) + '...' 
          : campaign.content,
        recipients: campaign.recipients,
        recipientCount,
        recipientType,
        recipientTypeLabel: getRecipientTypeLabel(recipientType),
        status: campaign.status,
        sentAt: campaign.sentAt,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        attachments,
        hasAttachments: attachments.length > 0,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        successRate: campaign.sentCount && recipientCount > 0 
          ? Math.round((campaign.sentCount / recipientCount) * 100)
          : 0
      };
    });
    
    // Calculate summary statistics
    const summary = {
      totalCampaigns: totalCount,
      sentEmails: formattedCampaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0),
      failedEmails: formattedCampaigns.reduce((sum, c) => sum + (c.failedCount || 0), 0),
      totalRecipients: formattedCampaigns.reduce((sum, c) => sum + (c.recipientCount || 0), 0),
      draftCampaigns: formattedCampaigns.filter(c => c.status === 'draft').length,
      publishedCampaigns: formattedCampaigns.filter(c => c.status === 'published').length,
      campaignsWithAttachments: formattedCampaigns.filter(c => c.hasAttachments).length,
      averageSuccessRate: formattedCampaigns.length > 0
        ? Math.round(formattedCampaigns.reduce((sum, c) => sum + c.successRate, 0) / formattedCampaigns.length)
        : 0
    };
    
    const response = {
      success: true,
      campaigns: formattedCampaigns,
      summary,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPreviousPage: page > 1
      }
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, max-age=60',
      }
    });
    
  } catch (error) {
    console.error(`GET Error:`, error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to retrieve campaigns"
    }, { status: 500 });
  }
}