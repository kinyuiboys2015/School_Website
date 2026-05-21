import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import nodemailer from "nodemailer";
import cloudinary from "../../../../libs/cloudinary";

// ==================== TOKEN VERIFICATION FOR PUT/DELETE/PATCH ====================
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
            message: 'User does not have permission to manage email campaigns' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Email campaign management authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to manage email campaigns.",
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
const CONTACT_PHONE = process.env.CONTACT_PHONE || '0790 789847';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'kinyuiboys2015@gmail.com';
const SCHOOL_WEBSITE = process.env.SCHOOL_WEBSITE || 'https://kinyuiboyssenior.school';

// Social Media Configuration
const SOCIAL_MEDIA = {
  facebook: {
    url: process.env.SCHOOL_FACEBOOK || 'https://facebook.com/kinyui boys-seniorschool',
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
  
  safeContent = safeContent.replace(/\n/g, '<br>');
  safeContent = safeContent.replace(/style\s*=\s*["'][^"']*font[^"']*["']/gi, '');

  return safeContent;
}

function getFileIcon(fileType) {
  const icons = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'xls': '📊',
    'xlsx': '📊',
    'ppt': '📽️',
    'pptx': '📽️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'txt': '📃',
    'zip': '📦',
    'rar': '📦',
    'mp3': '🎵',
    'mp4': '🎬',
    'webp': '🖼️',
    'svg': '🖼️'
  };
  
  return icons[fileType?.toLowerCase()] || '📎';
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
  
  return mimeTypes[fileType?.toLowerCase()] || 'application/octet-stream';
}

// FULL MOBILE-RESPONSIVE EMAIL TEMPLATE FUNCTION WITH INLINE STYLING
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
  let attachmentsHTML = '';
  if (attachments && attachments.length > 0) {
    attachmentsHTML = `
    <tr>
      <td style="padding: 0 6% 6%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #64748b;">
          <tr>
            <td style="padding: 5%;">
              <p style="color: #0f172a; font-size: clamp(14px, 3.5vw, 15px); font-weight: 700; margin: 0 0 12px;">📎 Attachments (${attachments.length})</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${attachments.map(attachment => {
                  const fileSize = formatFileSize(attachment.fileSize);
                  const icon = getFileIcon(attachment.fileType);
                  return `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 16px; margin-right: 6px;">${icon}</span>
                    <a href="${attachment.url}" target="_blank" style="color: #334155; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600; text-decoration: none;">${attachment.originalName || attachment.filename}</a>
                    <span style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin-left: 6px;">(${fileSize})</span>
                  </td>
                </tr>`;
                }).join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  }

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
                      <h1 style="color: #ffffff; font-size: clamp(20px, 5.5vw, 26px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">${SCHOOL_NAME}</h1>
                      <p style="color: rgba(255,255,255,0.7); font-size: clamp(11px, 2.8vw, 13px); margin: 0 0 10px; font-style: italic;">${SCHOOL_MOTTO}</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
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
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right: 16px;">
                      <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin: 0; letter-spacing: 0.03em;">
                        ${new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                      </p>
                    </td>
                    <td>
                      <span style="display: inline-block; background: #f1f5f9; padding: 2px 10px; border-radius: 12px; font-size: clamp(10px, 2.5vw, 11px); color: #64748b; font-weight: 600;">For: ${recipientTypeLabel}</span>
                    </td>
                  </tr>
                </table>
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
                      <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">${SCHOOL_NAME} Administration</p>
                      <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 4px 0 0;">Confidential communication for authorized recipients only.</p>
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

// 🔹 GET - Retrieve a specific campaign by ID (PUBLIC)
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    // Fetch campaign from database
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });
    
    if (!campaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Parse attachments
    let attachments = [];
    try {
      if (campaign.attachments) {
        attachments = JSON.parse(campaign.attachments);
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    
    const recipientCount = campaign.recipients ? campaign.recipients.split(',').length : 0;
    
    const responseData = {
      id: campaign.id,
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content,
      recipients: campaign.recipients,
      recipientCount,
      recipientType: campaign.recipientType,
      recipientTypeLabel: getRecipientTypeLabel(campaign.recipientType),
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
    
    return NextResponse.json({
      success: true,
      campaign: responseData
    });
    
  } catch (error) {
    console.error(`GET [id] Error:`, error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to retrieve campaign"
    }, { status: 500 });
  }
}

// 🔹 PUT - Update an existing campaign (PROTECTED)
export async function PUT(req, { params }) {
  try {
    // ==================== ADD AUTHENTICATION HERE ====================
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("✏️ PUT /api/email-campaigns/[id] - Updating campaign");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    // ==================== END AUTHENTICATION ====================

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const data = await req.json();
    const { title, subject, content, recipients, status, recipientType, attachments } = data;
    
    // Check if campaign exists
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });
    
    if (!existingCampaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Build update data
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (subject !== undefined) updateData.subject = subject;
    if (content !== undefined) {
      const MAX_CONTENT_LENGTH = 65535;
      if (content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json({ 
          success: false, 
          error: `Content is too long. Maximum ${MAX_CONTENT_LENGTH} characters allowed.`,
          currentLength: content.length
        }, { status: 400 });
      }
      updateData.content = content;
    }
    
    if (recipients !== undefined) {
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
      
      const uniqueEmails = [...new Set(validEmails)];
      updateData.recipients = uniqueEmails.join(', ');
    }
    
    if (recipientType !== undefined) updateData.recipientType = recipientType;
    if (status !== undefined) updateData.status = status;
    if (attachments !== undefined) {
      updateData.attachments = attachments ? JSON.stringify(attachments) : null;
    }
    
  
    
    // Update campaign in database
    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData,
    });
    
    // Send emails if status changed to published
    let emailResults = null;
    if (status === 'published' && existingCampaign.status !== 'published') {
      try {
        emailResults = await sendModernEmails(updatedCampaign);
        
        // Update campaign with email results
        await prisma.emailCampaign.update({
          where: { id },
          data: { 
            sentAt: new Date(),
            sentCount: emailResults.summary.successful,
            failedCount: emailResults.summary.failed
          },
        });
        
        // Refresh the updated campaign
        const refreshedCampaign = await prisma.emailCampaign.findUnique({
          where: { id }
        });
        
        updatedCampaign.sentAt = refreshedCampaign.sentAt;
        updatedCampaign.sentCount = refreshedCampaign.sentCount;
        updatedCampaign.failedCount = refreshedCampaign.failedCount;
        
      } catch (emailError) {
        console.error(`Email sending failed:`, emailError);
        emailResults = {
          error: emailError.message,
          summary: {
            successful: 0,
            failed: updatedCampaign.recipients ? updatedCampaign.recipients.split(',').length : 0
          }
        };
      }
    }
    
    // Parse attachments for response
    let responseAttachments = [];
    try {
      if (updatedCampaign.attachments) {
        responseAttachments = JSON.parse(updatedCampaign.attachments);
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    
    const recipientCount = updatedCampaign.recipients.split(',').length;
    
    const response = {
      success: true,
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        subject: updatedCampaign.subject,
        content: updatedCampaign.content,
        recipients: updatedCampaign.recipients,
        recipientCount,
        recipientType: updatedCampaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(updatedCampaign.recipientType || 'all'),
        status: updatedCampaign.status,
        sentAt: updatedCampaign.sentAt,
        sentCount: updatedCampaign.sentCount,
        failedCount: updatedCampaign.failedCount,
        attachments: responseAttachments,
        hasAttachments: responseAttachments.length > 0,
        createdAt: updatedCampaign.createdAt,
        updatedAt: updatedCampaign.updatedAt
      },
      emailResults,
      message: status === 'published' && existingCampaign.status !== 'published'
        ? `Campaign updated and ${emailResults?.summary?.successful || 0} emails sent successfully`
        : 'Campaign updated successfully'
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`PUT Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to update campaign";
    
    if (error.code === 'P2000') {
      statusCode = 400;
      errorMessage = "Data too long for database column. Please shorten your content.";
    } else if (error.code === 'P2025') {
      statusCode = 404;
      errorMessage = "Campaign not found";
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: statusCode });
  }
}

// 🔹 DELETE - Delete a campaign (PROTECTED)
export async function DELETE(req, { params }) {
  try {
    // ==================== ADD AUTHENTICATION HERE ====================
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("🗑️ DELETE /api/email-campaigns/[id] - Deleting campaign");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    // ==================== END AUTHENTICATION ====================

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    // First, get the campaign to check for attachments
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      select: { attachments: true }
    });
    
    if (!campaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Delete campaign from database
    await prisma.emailCampaign.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Campaign deleted successfully',
    });
    
  } catch (error) {
    console.error(`DELETE Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to delete campaign";
    
    if (error.code === 'P2025') {
      statusCode = 404;
      errorMessage = "Campaign not found";
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: statusCode });
  }
}

// 🔹 PATCH - Partial update (e.g., update status only) (PROTECTED)
export async function PATCH(req, { params }) {
  try {
    // ==================== ADD AUTHENTICATION HERE ====================
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("📝 PATCH /api/email-campaigns/[id] - Partial update");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    // ==================== END AUTHENTICATION ====================

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const data = await req.json();
    const { status, ...otherUpdates } = data;
    
    // Check if campaign exists
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });
    
    if (!existingCampaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Build update data
    const updateData = {};
    
    if (status !== undefined) {
      if (status === 'published' && existingCampaign.status !== 'published') {
        updateData.status = status;
      } else if (status !== 'published') {
        updateData.status = status;
      }
    }
    
    // Add any other partial updates
    Object.keys(otherUpdates).forEach(key => {
      if (otherUpdates[key] !== undefined) {
        updateData[key] = otherUpdates[key];
      }
    });
    

    
    // Update campaign
    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData,
    });
    
    // Send emails if status changed to published
    let emailResults = null;
    if (status === 'published' && existingCampaign.status !== 'published') {
      try {
        emailResults = await sendModernEmails(updatedCampaign);
        
        // Update campaign with email results
        await prisma.emailCampaign.update({
          where: { id },
          data: { 
            sentAt: new Date(),
            sentCount: emailResults.summary.successful,
            failedCount: emailResults.summary.failed
          },
        });
        
        // Refresh the updated campaign
        const refreshedCampaign = await prisma.emailCampaign.findUnique({
          where: { id }
        });
        
        updatedCampaign.sentAt = refreshedCampaign.sentAt;
        updatedCampaign.sentCount = refreshedCampaign.sentCount;
        updatedCampaign.failedCount = refreshedCampaign.failedCount;
        
      } catch (emailError) {
        console.error(`Email sending failed:`, emailError);
        emailResults = {
          error: emailError.message,
          summary: {
            successful: 0,
            failed: updatedCampaign.recipients ? updatedCampaign.recipients.split(',').length : 0
          }
        };
      }
    }
    
    // Parse attachments for response
    let responseAttachments = [];
    try {
      if (updatedCampaign.attachments) {
        responseAttachments = JSON.parse(updatedCampaign.attachments);
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    
    const recipientCount = updatedCampaign.recipients.split(',').length;
    
    const response = {
      success: true,
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        subject: updatedCampaign.subject,
        content: updatedCampaign.content,
        recipients: updatedCampaign.recipients,
        recipientCount,
        recipientType: updatedCampaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(updatedCampaign.recipientType || 'all'),
        status: updatedCampaign.status,
        sentAt: updatedCampaign.sentAt,
        sentCount: updatedCampaign.sentCount,
        failedCount: updatedCampaign.failedCount,
        attachments: responseAttachments,
        hasAttachments: responseAttachments.length > 0,
        createdAt: updatedCampaign.createdAt,
        updatedAt: updatedCampaign.updatedAt
      },
      emailResults,
      message: status === 'published' && existingCampaign.status !== 'published'
        ? `Campaign sent to ${emailResults?.summary?.successful || 0} recipients successfully`
        : 'Campaign updated successfully'
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`PATCH Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to update campaign";
    
    if (error.code === 'P2025') {
      statusCode = 404;
      errorMessage = "Campaign not found";
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: statusCode });
  }
}

// Helper function to send emails (missing from original code)
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
  
  // Prepare email attachments for nodemailer
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
      // Generate email content
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

// Helper to validate email addresses (missing from original code)
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
