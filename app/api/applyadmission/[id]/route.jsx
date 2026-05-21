import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import nodemailer from 'nodemailer'; 
import { randomBytes } from "crypto";

// ====================================================================
// CONFIGURATION
// ====================================================================
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const SCHOOL_NAME = ' kinyui boys Senior  School';
const SCHOOL_LOCATION = 'Matungulu, Machakos County';
const SCHOOL_MOTTO = 'Soaring to Excellence';
const CONTACT_PHONE = '0790 789847';
const CONTACT_EMAIL = 'kinyuiboys2015@gmail.com';
// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager
class DeviceTokenManager {
  static KEYS = {
    DEVICE_TOKEN: 'device_token',
    DEVICE_FINGERPRINT: 'device_fingerprint',
    LOGIN_COUNT: 'login_count',
    LAST_LOGIN: 'last_login'
  };

  // Validate both admin token and device token from headers
  static validateTokensFromHeaders(headers) {
    try {
      // Extract tokens from headers
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      // Validate admin token format (basic check)
      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      // Validate device token
      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      // Parse admin token payload
      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        // Check expiration
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        // Check user role
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL', 'ADMISSIONS_OFFICER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { valid: false, reason: 'invalid_role', message: 'User does not have required permissions' };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
        adminToken: adminToken,
        deviceToken: deviceToken,
        user: {
          id: adminPayload.id,
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

  // Validate device token
  static validateDeviceToken(token) {
    try {
      // Handle base64 decoding safely
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      // Check age (30 days max)
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

// Authentication middleware for PATCH and DELETE
const authenticateRequest = (req) => {
  const headers = req.headers;
  
  // Validate tokens
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "It seems you're not authenticated to automate this action. Please login again.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.deviceInfo
  };
};

// ====================================================================
// UTILITY FUNCTIONS

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const randomNum = randomBytes(4).toString('hex').toUpperCase();
  return `KBSS/${year}/${randomNum}`;
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(07|01)\d{8}$/;
  return regex.test(cleaned);
}

function getStatusLabel(status) {
  const statusMap = {
    'PENDING': 'Pending',
    'UNDER_REVIEW': 'Under Review',
    'INTERVIEW_SCHEDULED': 'Interview Scheduled',
    'INTERVIEWED': 'Interviewed',
    'ACCEPTED': 'Accepted',
    'CONDITIONAL_ACCEPTANCE': 'Conditional Acceptance',
    'WAITLISTED': 'Waitlisted',
    'REJECTED': 'Rejected',
    'WITHDRAWN': 'Withdrawn'
  };
  return statusMap[status] || status;
}

function getStreamLabel(stream) {
  const streamMap = {
    'SCIENCE': 'Science',
    'ARTS': 'Arts',
    'BUSINESS': 'Business',
    'TECHNICAL': 'Technical'
  };
  return streamMap[stream] || stream;
}


function formatDate(date) {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ====================================================================
// EMAIL TEMPLATE FUNCTIONS - FULLY MOBILE RESPONSIVE WITH SIMPLE BUTTONS
// ====================================================================

function getApplicantConfirmationTemplate(name, appNumber) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="x-apple-disable-message-reformatting">
      <title>Application Confirmation - ${SCHOOL_NAME}</title>
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
                        <div style="display: inline-block; background: rgba(255,255,255,0.1); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; text-align: center;">
                          <span style="font-size: 28px;">🏫</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: white; font-size: clamp(20px, 5.5vw, 26px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">${SCHOOL_NAME}</h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 4px 0 0; font-weight: 500;">${SCHOOL_LOCATION}</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 10px;">
                        <span style="display: inline-block; background: rgba(34,197,94,0.2); border: 1px solid rgba(34,197,94,0.3); padding: 5px 18px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #86efac;">&#10003; Application Received</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SUCCESS BANNER -->
              <tr>
                <td style="padding: 6% 6% 2%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; border: 1px solid #a7f3d0; text-align: center;">
                    <tr>
                      <td style="padding: 6%;">
                        <p style="font-size: 40px; margin: 0 0 8px;">🎉</p>
                        <span style="display: inline-block; background: #059669; color: white; padding: 8px 22px; border-radius: 50px; font-weight: 700; font-size: clamp(12px, 3vw, 14px);">Application Submitted Successfully!</span>
                        <p style="color: #047857; font-size: clamp(16px, 4.2vw, 20px); font-weight: 700; margin: 14px 0 0;">Welcome to ${SCHOOL_NAME} Admissions</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- GREETING -->
              <tr>
                <td style="padding: 5% 6% 2%;">
                  <p style="color: #334155; font-size: clamp(14px, 3.5vw, 16px); margin: 0; line-height: 1.7;">
                    Dear <strong style="color: #0f172a;">${name}</strong>,
                  </p>
                  <p style="color: #475569; font-size: clamp(13px, 3.2vw, 15px); margin: 12px 0 0; line-height: 1.7;">
                    Thank you for choosing ${SCHOOL_NAME} for your education journey. We have successfully received your admission application and it is now under review by our team.
                  </p>
                </td>
              </tr>

              <!-- DIVIDER -->
              <tr><td style="padding: 4% 6%;"><div style="height: 1px; background: #e2e8f0;"></div></td></tr>

              <!-- APPLICANT NAME CARD -->
              <tr>
                <td style="padding: 0 6% 4%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; border: 1px solid #a7f3d0; border-left: 4px solid #059669;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px;">📝 Applicant Name</p>
                        <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #047857; margin: 0; word-break: break-word; line-height: 1.3;">${name}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- APPLICATION NUMBER CARD -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; border-left: 4px solid #0284c7;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; color: #075985; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px;">🔐 Application Number</p>
                        <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #0c4a6e; margin: 0; word-break: break-word; line-height: 1.3;">${appNumber}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- WHAT HAPPENS NEXT -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="color: #1e40af; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 14px;">📋 What Happens Next?</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid rgba(59,130,246,0.15);">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="width: 30px; vertical-align: top; font-size: 18px;">🔍</td>
                                <td style="padding-left: 10px; color: #1e3a5f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><strong>Application Review:</strong> Our admissions team will review your application within 7-14 working days</td>
                              </tr></table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid rgba(59,130,246,0.15);">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="width: 30px; vertical-align: top; font-size: 18px;">📧</td>
                                <td style="padding-left: 10px; color: #1e3a5f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><strong>Status Updates:</strong> You will receive email notifications at every stage of the process</td>
                              </tr></table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid rgba(59,130,246,0.15);">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="width: 30px; vertical-align: top; font-size: 18px;">📞</td>
                                <td style="padding-left: 10px; color: #1e3a5f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><strong>Verification:</strong> We may contact you for additional information or clarification</td>
                              </tr></table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="width: 30px; vertical-align: top; font-size: 18px;">🎯</td>
                                <td style="padding-left: 10px; color: #1e3a5f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><strong>Decision:</strong> Final admission decision will be communicated via email</td>
                              </tr></table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- IMPORTANT NOTES -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #fde68a; border-left: 4px solid #f59e0b;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="color: #92400e; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 12px;">⚠️ Important Notes</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr><td style="padding: 4px 0; color: #78350f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><span style="color: #d97706; font-weight: 700; margin-right: 6px;">&#8226;</span> Keep your application number <strong>${appNumber}</strong> safe for future reference</td></tr>
                          <tr><td style="padding: 4px 0; color: #78350f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><span style="color: #d97706; font-weight: 700; margin-right: 6px;">&#8226;</span> All communications will be sent to this email address</td></tr>
                          <tr><td style="padding: 4px 0; color: #78350f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><span style="color: #d97706; font-weight: 700; margin-right: 6px;">&#8226;</span> Do not share your application details with unauthorized persons</td></tr>
                          <tr><td style="padding: 4px 0; color: #78350f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;"><span style="color: #d97706; font-weight: 700; margin-right: 6px;">&#8226;</span> Application review typically takes 2-3 weeks</td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CONTACT SECTION -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 4px;">📞 Need Help?</p>
                        <p style="color: #64748b; font-size: clamp(12px, 3vw, 13px); margin: 0 0 14px;">Our admissions team is here to assist you:</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="width: 32px; vertical-align: middle;"><div style="background: #059669; color: white; width: 28px; height: 28px; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px;">☎</div></td>
                                <td style="padding-left: 12px; color: #334155; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600;"><a href="tel:${CONTACT_PHONE}" style="color: #334155; text-decoration: none;">${CONTACT_PHONE}</a></td>
                              </tr></table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="width: 32px; vertical-align: middle;"><div style="background: #d97706; color: white; width: 28px; height: 28px; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px;">✉</div></td>
                                <td style="padding-left: 12px; color: #334155; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600;"><a href="mailto:${CONTACT_EMAIL}" style="color: #334155; text-decoration: none;">${CONTACT_EMAIL}</a></td>
                              </tr></table>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #94a3b8; font-size: clamp(10px, 2.5vw, 11px); margin: 12px 0 0; font-style: italic;">Office Hours: Monday - Friday, 8:00 AM - 5:00 PM</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SIGN-OFF -->
              <tr>
                <td style="padding: 0 6% 6%; text-align: center;">
                  <div style="border-top: 1px solid #e2e8f0; padding-top: 5%;"></div>
                  <p style="color: #0f172a; font-size: clamp(14px, 3.5vw, 15px); font-weight: 600; margin: 0 0 6px;">We look forward to reviewing your application!</p>
                  <p style="color: #475569; font-size: clamp(13px, 3.2vw, 14px); margin: 0;">Best regards,<br><strong>The Admissions Team</strong><br>${SCHOOL_NAME}</p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background: #0f172a; padding: 8% 6%; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td align="center"><p style="color: #ffffff; font-size: clamp(15px, 4vw, 17px); font-weight: 700; margin: 0 0 4px; letter-spacing: -0.01em;">${SCHOOL_NAME}</p></td></tr>
                    <tr><td align="center"><p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">"${SCHOOL_MOTTO}"</p></td></tr>
                    <tr><td align="center"><p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 14px;">${SCHOOL_LOCATION}</p></td></tr>
                    <tr>
                      <td align="center">
                        <div style="width: 40px; height: 2px; background: #475569; margin: 0 auto 12px;"></div>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">&copy; ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">This is an automated confirmation email. Please do not reply.</p>
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
    </html>
  `;
}

function getAdminNotificationTemplate(applicantData, applicationNumber) {
  const age = calculateAge(applicantData.dateOfBirth);
  const kcpeMarks = applicantData.kcpeMarks || 'Not provided';
  const formattedDate = formatDate(new Date());
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="x-apple-disable-message-reformatting">
      <title>New Application - ${SCHOOL_NAME}</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; line-height: 1.6; color: #1e293b; -webkit-text-size-adjust: 100%;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f1f5f9;">
        <tr>
          <td align="center" style="padding: 4% 3%;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15,23,42,0.08);">

              <!-- HEADER -->
              <tr>
                <td style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%); padding: 8% 6%; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 10px;">
                        <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; text-align: center;">
                          <span style="font-size: 28px;">🚨</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: white; font-size: clamp(18px, 5vw, 24px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">NEW APPLICATION</h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 4px 0 0; font-weight: 500;">${SCHOOL_NAME} Admissions System</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 10px;">
                        <span style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 5px 18px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #fecaca;">&#9888; Action Required</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- ALERT BANNER -->
              <tr>
                <td style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 4% 6%; text-align: center;">
                  <p style="margin: 0; font-weight: 700; color: #991b1b; font-size: clamp(13px, 3.2vw, 14px);">A new student application requires review</p>
                </td>
              </tr>

              <!-- APPLICATION CARD -->
              <tr>
                <td style="padding: 6% 6% 4%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; text-align: center;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="font-size: clamp(12px, 3vw, 14px); font-weight: 600; color: #075985; margin: 0 0 6px;">Application: ${applicationNumber}</p>
                        <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #0c4a6e; margin: 0 0 6px;">${applicantData.firstName} ${applicantData.lastName}</p>
                        <p style="font-size: clamp(11px, 2.8vw, 12px); color: #64748b; margin: 0;">Submitted: ${formattedDate}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- APPLICATION DETAILS SECTION -->
              <tr>
                <td style="padding: 0 6% 2%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td style="padding-bottom: 10px; border-bottom: 2px solid #fee2e2;"><p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #b91c1c; margin: 0;">📋 Application Details</p></td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 2% 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Full Name</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569; word-break: break-word;">${applicantData.firstName} ${applicantData.middleName || ''} ${applicantData.lastName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Date of Birth</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${formatDate(applicantData.dateOfBirth)} (Age: ${age})</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Gender</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.gender}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Nationality</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.nationality}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">County</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.county}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Preferred Stream</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${getStreamLabel(applicantData.preferredStream)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Previous School</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.previousSchool}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">KPSEA Score</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.kpseaMarks ? applicantData.kpseaMarks + '/100' : (applicantData.kcpeMarks || 'Not provided')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">KJSEA Grade</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.kjseaGrade || applicantData.meanGrade || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Contact Email</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569; word-break: break-word;">${applicantData.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Contact Phone</td>
                      <td style="padding: 10px 14px; background: #ffffff; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.phone}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- NEXT STEPS -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; border: 1px solid #a7f3d0; border-left: 4px solid #059669;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="color: #065f46; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 12px;">✅ Next Steps</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">1. Review application completeness</td></tr>
                          <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">2. Verify academic credentials</td></tr>
                          <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">3. Check for any missing documents</td></tr>
                          <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">4. Update application status in portal</td></tr>
                          <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">5. Schedule interview if required</td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- URGENCY NOTICE -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #fde68a; text-align: center;">
                    <tr>
                      <td style="padding: 4%;">
                        <p style="margin: 0; font-weight: 700; color: #92400e; font-size: clamp(12px, 3vw, 13px);">⏰ Please process this application within 48 hours</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SCHOOL DETAILS -->
              <tr>
                <td style="padding: 0 6% 6%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 4%;">
                        <p style="font-size: clamp(12px, 3vw, 13px); color: #475569; margin: 0; line-height: 1.7;">
                          <strong style="color: #0f172a;">School:</strong> ${SCHOOL_NAME}<br>
                          <strong style="color: #0f172a;">Location:</strong> ${SCHOOL_LOCATION}<br>
                          <strong style="color: #0f172a;">Motto:</strong> "${SCHOOL_MOTTO}"
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
                    <tr><td align="center"><p style="color: #ffffff; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 4px;">${SCHOOL_NAME} Admissions Portal</p></td></tr>
                    <tr>
                      <td align="center">
                        <div style="width: 40px; height: 2px; background: #475569; margin: 10px auto;"></div>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">This is an automated notification from the admissions system.</p>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">Please log in to the portal to take action.</p>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">&copy; ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
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
    </html>
  `;
}

function getStatusUpdateTemplate(application, newStatus, updateData = {}) {
  const statusLabel = getStatusLabel(newStatus);
  const applicantName = `${application.firstName} ${application.lastName}`;
  const applicationNumber = application.applicationNumber;
  
  let subjectIcon = '';
  let title = '';
  let message = '';
  let actionSection = '';
  let headerGradient = 'linear-gradient(135deg, #0f172a 0%, #334155 100%)';
  
  switch (newStatus) {
    case 'ACCEPTED':
      subjectIcon = '🎉';
      title = 'Congratulations! Admission Offer';
      headerGradient = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      message = `We are pleased to inform you that your application to ${SCHOOL_NAME} has been <strong>ACCEPTED</strong>. Welcome to our school community!`;
      actionSection = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; border: 1px solid #a7f3d0;">
          <tr><td style="padding: 5%;">
            <p style="color: #065f46; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 12px;">&#10003; Next Steps to Complete Admission:</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 14px); line-height: 1.6;">1. Complete the admission acceptance form</td></tr>
              <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 14px); line-height: 1.6;">2. Submit all required documents</td></tr>
              <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 14px); line-height: 1.6;">3. Pay admission fees as per fee structure</td></tr>
              <tr><td style="padding: 5px 0; color: #047857; font-size: clamp(12px, 3vw, 14px); line-height: 1.6;">4. Report on: <strong>${updateData.reportingDate ? formatDate(updateData.reportingDate) : 'To be communicated'}</strong></td></tr>
            </table>
            ${updateData.assignedStream ? `<p style="margin-top: 12px; font-size: clamp(12px, 3vw, 14px); color: #047857;"><strong>Assigned Stream:</strong> ${getStreamLabel(updateData.assignedStream)}</p>` : ''}
          </td></tr>
        </table>
      `;
      break;
      
    case 'REJECTED':
      subjectIcon = '📄';
      headerGradient = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
      title = 'Application Status Update';
      message = `After careful review, we regret to inform you that your application to ${SCHOOL_NAME} has not been successful at this time.`;
      actionSection = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #dc2626;">
          <tr><td style="padding: 5%;">
            <p style="color: #7f1d1d; font-size: clamp(13px, 3.2vw, 15px); font-weight: 700; margin: 0 0 8px;">Application Feedback:</p>
            <p style="font-size: clamp(12px, 3vw, 13px); margin: 0; color: #475569;"><strong>Reason:</strong> ${updateData.rejectionReason || 'Application did not meet admission criteria.'}</p>
          </td></tr>
        </table>
      `;
      break;
      
    case 'INTERVIEW_SCHEDULED':
      subjectIcon = '📅';
      headerGradient = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
      title = 'Interview Scheduled';
      message = `Your application to ${SCHOOL_NAME} has progressed to the interview stage. We would like to invite you for an interview.`;
      actionSection = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 12px; border: 1px solid #c4b5fd;">
          <tr><td style="padding: 5%;">
            <p style="color: #5b21b6; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 14px;">📅 Interview Details:</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-bottom: 10px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 8px; border: 1px solid #ddd6fe;">
                    <tr><td style="padding: 12px;">
                      <p style="margin: 0 0 3px 0; font-size: clamp(10px, 2.5vw, 12px); color: #64748b;">Date</p>
                      <p style="margin: 0; font-weight: 700; color: #1e293b; font-size: clamp(13px, 3.2vw, 15px);">${updateData.interviewDate ? formatDate(updateData.interviewDate) : 'To be confirmed'}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 8px; border: 1px solid #ddd6fe;">
                    <tr><td style="padding: 12px;">
                      <p style="margin: 0 0 3px 0; font-size: clamp(10px, 2.5vw, 12px); color: #64748b;">Time</p>
                      <p style="margin: 0; font-weight: 700; color: #1e293b; font-size: clamp(13px, 3.2vw, 15px);">${updateData.interviewTime || 'To be confirmed'}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      `;
      break;
      
    case 'WAITLISTED':
      subjectIcon = '⏳';
      headerGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      title = 'Application Waitlisted';
      message = `Your application to ${SCHOOL_NAME} has been placed on a <strong>WAITLIST</strong>. We will contact you if a space becomes available.`;
      actionSection = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #fde68a;">
          <tr><td style="padding: 5%;">
            <p style="font-size: clamp(12px, 3vw, 13px); margin: 0; color: #92400e;">We will notify you immediately if a space becomes available.</p>
          </td></tr>
        </table>
      `;
      break;
      
    case 'CONDITIONAL_ACCEPTANCE':
      subjectIcon = '📝';
      headerGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      title = 'Conditional Admission Offer';
      message = `Your application to ${SCHOOL_NAME} has received a <strong>CONDITIONAL ACCEPTANCE</strong>. Please review the conditions below.`;
      actionSection = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #fde68a; border-left: 4px solid #f59e0b;">
          <tr><td style="padding: 5%;">
            <p style="color: #92400e; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 12px;">📋 Conditions to Fulfill:</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 8px; border: 1px solid #fde68a;">
              <tr><td style="padding: 14px;">
                <p style="font-size: clamp(12px, 3vw, 13px); margin: 0; color: #475569;">${updateData.conditions || 'Please contact admissions for specific conditions.'}</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      `;
      break;
      
    default:
      title = 'Application Status Update';
      message = `Your application status has been updated to: <strong>${statusLabel}</strong>.`;
  }
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="x-apple-disable-message-reformatting">
      <title>Status Update - ${SCHOOL_NAME}</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; line-height: 1.6; color: #1e293b; -webkit-text-size-adjust: 100%;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f1f5f9;">
        <tr>
          <td align="center" style="padding: 4% 3%;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15,23,42,0.08);">

              <!-- HEADER -->
              <tr>
                <td style="background: ${headerGradient}; padding: 8% 6%; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 10px;">
                        <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; text-align: center;">
                          <span style="font-size: 28px;">${subjectIcon}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: white; font-size: clamp(18px, 5vw, 24px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">${title}</h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 4px 0 0; font-weight: 500;">${SCHOOL_NAME}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- STATUS CARD -->
              <tr>
                <td style="padding: 6% 6% 4%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; text-align: center;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="font-size: clamp(11px, 2.8vw, 12px); font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #0369a1; margin: 0 0 8px;">Status Update</p>
                        <span style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 6px 20px; border-radius: 24px; font-size: clamp(12px, 3vw, 14px); font-weight: 700;">${statusLabel}</span>
                        <p style="font-size: clamp(13px, 3.2vw, 15px); line-height: 1.7; margin: 14px 0 0; color: #334155;">${message}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- APPLICANT INFO -->
              <tr>
                <td style="padding: 0 6% 4%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right: 6px; width: 50%; vertical-align: top;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                          <tr><td style="padding: 14px;">
                            <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 800; text-transform: uppercase; color: #0369a1; letter-spacing: 0.05em; margin: 0 0 6px;">Applicant Name</p>
                            <p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #075985; margin: 0; word-break: break-word;">${applicantName}</p>
                          </td></tr>
                        </table>
                      </td>
                      <td style="padding-left: 6px; width: 50%; vertical-align: top;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                          <tr><td style="padding: 14px;">
                            <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 800; text-transform: uppercase; color: #0369a1; letter-spacing: 0.05em; margin: 0 0 6px;">Application Number</p>
                            <p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #075985; margin: 0; word-break: break-word;">${applicationNumber}</p>
                          </td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- ACTION SECTION -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  ${actionSection}
                </td>
              </tr>

              <!-- CONTACT SECTION -->
              <tr>
                <td style="padding: 0 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; text-align: center;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #0c4a6e; margin: 0 0 14px;">Need Assistance?</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding-right: 6px; width: 50%; vertical-align: top;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 8px; border: 1px solid #bae6fd;">
                                <tr>
                                  <td style="padding: 12px; text-align: center;">
                                    <span style="display: inline-block; background: linear-gradient(135deg, #0284c7, #0369a1); color: white; border-radius: 6px; width: 28px; height: 28px; line-height: 28px; font-size: 14px; text-align: center;">&#9742;</span>
                                    <p style="margin: 6px 0 0; font-size: clamp(11px, 2.8vw, 13px); font-weight: 600; color: #0c4a6e;"><a href="tel:${CONTACT_PHONE}" style="color: #0c4a6e; text-decoration: none;">Call Us</a></p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td style="padding-left: 6px; width: 50%; vertical-align: top;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 8px; border: 1px solid #bae6fd;">
                                <tr>
                                  <td style="padding: 12px; text-align: center;">
                                    <span style="display: inline-block; background: linear-gradient(135deg, #0284c7, #0369a1); color: white; border-radius: 6px; width: 28px; height: 28px; line-height: 28px; font-size: 14px; text-align: center;">&#9993;</span>
                                    <p style="margin: 6px 0 0; font-size: clamp(11px, 2.8vw, 13px); font-weight: 600; color: #0c4a6e;"><a href="mailto:${CONTACT_EMAIL}" style="color: #0c4a6e; text-decoration: none;">Email Us</a></p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 12px 0 0; font-size: clamp(10px, 2.5vw, 12px); color: #64748b;">Office Hours: Monday - Friday, 8:00 AM - 5:00 PM</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SIGN-OFF -->
              <tr>
                <td style="padding: 0 6% 6%; text-align: center;">
                  <div style="width: 40px; height: 2px; background: #e2e8f0; margin: 0 auto 14px;"></div>
                  <p style="font-size: clamp(13px, 3.2vw, 15px); color: #0f172a; font-weight: 600; margin: 0 0 6px;">Thank you for your interest in ${SCHOOL_NAME}</p>
                  <p style="font-size: clamp(12px, 3vw, 14px); color: #475569; margin: 0;">Best regards,<br><strong>The Admissions Team</strong></p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background: #0f172a; padding: 8% 6%; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td align="center"><p style="color: #ffffff; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 4px;">${SCHOOL_NAME}</p></td></tr>
                    <tr><td align="center"><p style="color: #94a3b8; font-size: clamp(10px, 2.5vw, 12px); margin: 0 0 4px;">${SCHOOL_LOCATION}</p></td></tr>
                    <tr>
                      <td align="center">
                        <div style="width: 40px; height: 2px; background: #475569; margin: 10px auto;"></div>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">&copy; ${new Date().getFullYear()} ${SCHOOL_NAME}</p>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">This is an automated email. Please do not reply.</p>
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
    </html>
  `;
}

function getDeletionNotificationTemplate(application, deletedBy) {
  const applicantName = `${application.firstName} ${application.lastName}`;
  const applicationNumber = application.applicationNumber;
  const deletionDate = formatDate(new Date());
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="x-apple-disable-message-reformatting">
      <title>Application Deleted - ${SCHOOL_NAME}</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; line-height: 1.6; color: #1e293b; -webkit-text-size-adjust: 100%;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f1f5f9;">
        <tr>
          <td align="center" style="padding: 4% 3%;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15,23,42,0.08);">

              <!-- HEADER -->
              <tr>
                <td style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%); padding: 8% 6%; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 10px;">
                        <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; text-align: center;">
                          <span style="font-size: 28px;">&#128465;</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: white; font-size: clamp(18px, 5vw, 24px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">APPLICATION DELETED</h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 4px 0 0; font-weight: 500;">${SCHOOL_NAME} Admissions System</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- ALERT BANNER -->
              <tr>
                <td style="padding: 6% 6% 4%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 1px solid #fecaca; border-left: 4px solid #dc2626;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="color: #991b1b; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 6px;">&#9888; Application Record Deleted</p>
                        <p style="color: #7f1d1d; font-size: clamp(12px, 3vw, 14px); margin: 0; line-height: 1.6;">An application record has been permanently deleted from the admissions system.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- DELETED APPLICATION DETAILS -->
              <tr>
                <td style="padding: 0 6% 2%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td style="padding-bottom: 10px; border-bottom: 2px solid #fee2e2;"><p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #b91c1c; margin: 0;">Deleted Application Details</p></td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 2% 6% 5%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Applicant</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">App Number</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicationNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Email</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569; word-break: break-word;">${application.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Phone</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${application.phone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Deleted On</td>
                      <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${deletionDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; background: #f8fafc; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Deleted By</td>
                      <td style="padding: 10px 14px; background: #ffffff; font-size: clamp(12px, 3vw, 13px); color: #475569;">${deletedBy}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- DELETION NOTE -->
              <tr>
                <td style="padding: 0 6% 6%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 4%;">
                        <p style="margin: 0; color: #475569; font-size: clamp(12px, 3vw, 13px);"><strong style="color: #0f172a;">Note:</strong> This deletion is permanent and cannot be undone. All data has been removed.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background: #0f172a; padding: 8% 6%; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td align="center"><p style="color: #ffffff; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 4px;">${SCHOOL_NAME}</p></td></tr>
                    <tr><td align="center"><p style="color: #94a3b8; font-size: clamp(10px, 2.5vw, 12px); margin: 0 0 4px;">${SCHOOL_LOCATION}</p></td></tr>
                    <tr><td align="center"><p style="color: #94a3b8; font-size: clamp(10px, 2.5vw, 12px); font-style: italic; margin: 0 0 8px;">"${SCHOOL_MOTTO}"</p></td></tr>
                    <tr>
                      <td align="center">
                        <div style="width: 40px; height: 2px; background: #475569; margin: 6px auto;"></div>
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">&copy; ${new Date().getFullYear()} ${SCHOOL_NAME}. Confidential.</p>
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
    </html>
  `;
}

// ====================================================================
// POST HANDLER - CREATE APPLICATION (PUBLIC)
// ====================================================================

export async function POST(req) {
  try {
    const data = await req.json();
    
   // Validate required fields
const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 'phone', 'previousSchool', 'previousClass'];
for (const field of requiredFields) {
  if (!data[field]) {
    return NextResponse.json(
      { success: false, error: `${field} is required` },
      { status: 400 }
    );
  }

    }
    
    // Validate phone number
    if (!validatePhone(data.phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format. Use 07XXXXXXXX or 01XXXXXXXX" },
        { status: 400 }
      );
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Generate application number
    const applicationNumber = generateApplicationNumber();
    
// Prepare application data - CBC System
const applicationData = {
  // Personal Information
  firstName: data.firstName.trim(),
  lastName: data.lastName.trim(),
  middleName: data.middleName ? data.middleName.trim() : null,
  dateOfBirth: new Date(data.dateOfBirth),
  gender: data.gender,
  nationality: data.nationality || 'Kenyan',
  county: data.county || '',
  constituency: data.constituency || '',
  ward: data.ward || '',
  village: data.village || '',
  
  // Contact Information
  email: data.email.trim().toLowerCase(),
  phone: data.phone.replace(/\s/g, ''),
  alternativePhone: data.alternativePhone ? data.alternativePhone.replace(/\s/g, '') : null,
  postalAddress: data.postalAddress || '',
  postalCode: data.postalCode || '',
  
  // Parent/Guardian Information
  fatherName: data.fatherName || null,
  fatherPhone: data.fatherPhone ? data.fatherPhone.replace(/\s/g, '') : null,
  fatherEmail: data.fatherEmail || null,
  fatherOccupation: data.fatherOccupation || null,
  motherName: data.motherName || null,
  motherPhone: data.motherPhone ? data.motherPhone.replace(/\s/g, '') : null,
  motherEmail: data.motherEmail || null,
  motherOccupation: data.motherOccupation || null,
  guardianName: data.guardianName || null,
  guardianPhone: data.guardianPhone ? data.guardianPhone.replace(/\s/g, '') : null,
  guardianEmail: data.guardianEmail || null,
  guardianOccupation: data.guardianOccupation || null,
  
  // Academic Information - CBC System
  previousSchool: data.previousSchool.trim(),
  previousClass: data.previousClass.trim(),
  
  // CBC Fields
  kpseaYear: data.kpseaYear ? parseInt(data.kpseaYear) : null,
  kpseaIndex: data.kpseaIndex || null,
  kpseaMarks: data.kpseaMarks ? parseInt(data.kpseaMarks) : null,
  kjseaGrade: data.kjseaGrade || null,
  
  // Keep old fields for backward compatibility
  kcpeYear: data.kpseaYear ? parseInt(data.kpseaYear) : null,
  kcpeIndex: data.kpseaIndex || null,
  kcpeMarks: data.kpseaMarks ? parseInt(data.kpseaMarks) : null,
  meanGrade: data.kjseaGrade || null,
  
  // Medical Information
  medicalCondition: data.medicalCondition || null,
  allergies: data.allergies || null,
  bloodGroup: data.bloodGroup || null,
  
  // Extracurricular
  sportsInterests: data.sportsInterests || null,
  clubsInterests: data.clubsInterests || null,
  talents: data.talents || null,
  
  // Status
  applicationNumber: applicationNumber,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date()
};
    
    // Create application in database
    const application = await prisma.admissionApplication.create({
      data: applicationData
    });
    
    // Send confirmation email to applicant
    try {
      const applicantMailOptions = {
        from: {
          name: `${SCHOOL_NAME} Admissions`,
          address: process.env.EMAIL_USER
        },
        to: application.email,
        subject: `Application Confirmation: ${applicationNumber} - ${SCHOOL_NAME}`,
        html: getApplicantConfirmationTemplate(`${application.firstName} ${application.lastName}`, applicationNumber)
      };
      
      await transporter.sendMail(applicantMailOptions);
    } catch (emailError) {
      console.warn("Confirmation email failed:", emailError);
    }
    
    // Send notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
      const adminMailOptions = {
        from: {
          name: `${SCHOOL_NAME} Admissions System`,
          address: process.env.EMAIL_USER
        },
        to: adminEmail,
        subject: `🚨 New Application: ${application.firstName} ${application.lastName} (${applicationNumber})`,
        html: getAdminNotificationTemplate(applicationData, applicationNumber)
      };
      
      await transporter.sendMail(adminMailOptions);
    } catch (emailError) {
      console.warn("Admin notification email failed:", emailError);
    }
    
    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      data: {
        id: application.id,
        applicationNumber: application.applicationNumber,
        name: `${application.firstName} ${application.lastName}`,
        email: application.email,
        status: getStatusLabel(application.status),
        createdAt: application.createdAt
      }
    });
    
  } catch (error) {
    console.error("Create application error:", error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "Email or phone number already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to submit application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// GET HANDLER - RETRIEVE APPLICATIONS (PUBLIC)
// ====================================================================


export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Get single application by ID
    const application = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Format the response
    const formattedApplication = {
      // Basic Information
      id: application.id,
      applicationNumber: application.applicationNumber,
      firstName: application.firstName,
      lastName: application.lastName,
      middleName: application.middleName,
      gender: application.gender,
      dateOfBirth: application.dateOfBirth,
      nationality: application.nationality,
      county: application.county,
      constituency: application.constituency,
      ward: application.ward,
      village: application.village,
      
      // Contact Information
      email: application.email,
      phone: application.phone,
      alternativePhone: application.alternativePhone,
      postalAddress: application.postalAddress,
      postalCode: application.postalCode,
      
      // Parent/Guardian Information
      fatherName: application.fatherName,
      fatherPhone: application.fatherPhone,
      fatherEmail: application.fatherEmail,
      fatherOccupation: application.fatherOccupation,
      motherName: application.motherName,
      motherPhone: application.motherPhone,
      motherEmail: application.motherEmail,
      motherOccupation: application.motherOccupation,
      guardianName: application.guardianName,
      guardianPhone: application.guardianPhone,
      guardianEmail: application.guardianEmail,
      guardianOccupation: application.guardianOccupation,
      
     // Academic Information - CBC System
previousSchool: application.previousSchool,
previousClass: application.previousClass,

// New CBC Fields
kpseaYear: application.kpseaYear || application.kcpeYear,
kpseaIndex: application.kpseaIndex || application.kcpeIndex,
kpseaMarks: application.kpseaMarks || application.kcpeMarks,
kjseaGrade: application.kjseaGrade || application.meanGrade,

// Keep old fields for backward compatibility
kcpeYear: application.kcpeYear || application.kpseaYear,
kcpeIndex: application.kcpeIndex || application.kpseaIndex,
kcpeMarks: application.kcpeMarks || application.kpseaMarks,
meanGrade: application.meanGrade || application.kjseaGrade,
      
      // Medical Information
      medicalCondition: application.medicalCondition,
      allergies: application.allergies,
      bloodGroup: application.bloodGroup,
      
      // Extracurricular
      sportsInterests: application.sportsInterests,
      clubsInterests: application.clubsInterests,
      talents: application.talents,
      
      // Admission Decision Information
      status: application.status,
      decisionNotes: application.decisionNotes,
      admissionOfficer: application.admissionOfficer,
      decisionDate: application.decisionDate,
      admissionDate: application.admissionDate,
      assignedStream: application.assignedStream,
      reportingDate: application.reportingDate,
      admissionLetterSent: application.admissionLetterSent,
      rejectionDate: application.rejectionDate,
      rejectionReason: application.rejectionReason,
      alternativeSuggestions: application.alternativeSuggestions,
      waitlistPosition: application.waitlistPosition,
      waitlistNotes: application.waitlistNotes,
      interviewDate: application.interviewDate,
      interviewTime: application.interviewTime,
      interviewVenue: application.interviewVenue,
      interviewNotes: application.interviewNotes,
      conditions: application.conditions,
      conditionDeadline: application.conditionDeadline,
      houseAssigned: application.houseAssigned,
      admissionClass: application.admissionClass,
      admissionType: application.admissionType,
      documentsVerified: application.documentsVerified,
      documentsNotes: application.documentsNotes,
      
      // Timestamps
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      
      // Computed Fields
      fullName: `${application.firstName} ${application.middleName ? application.middleName + ' ' : ''}${application.lastName}`,
      age: calculateAge(application.dateOfBirth),
      statusLabel: getStatusLabel(application.status)
    };

    return NextResponse.json({
      success: true,
      data: formattedApplication
    });

  } catch (error) {
    console.error("Get single application error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to retrieve application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// PATCH HANDLER - UPDATE APPLICATION (PROTECTED)
// ====================================================================

export async function PATCH(req) {
  try {
    // Step 1: Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`✏️ Application update request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    const data = await req.json();
    
    // Check if application exists
    const existingApplication = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date(),
    };

    // Update basic fields if provided
    if (data.firstName) updateData.firstName = data.firstName.trim();
    if (data.lastName) updateData.lastName = data.lastName.trim();
    if (data.middleName !== undefined) updateData.middleName = data.middleName?.trim();
    if (data.gender) updateData.gender = data.gender;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    if (data.phone) updateData.phone = data.phone.replace(/\s/g, '');
    if (data.preferredStream) updateData.preferredStream = data.preferredStream;


    // Update CBC fields if provided
if (data.kpseaYear) updateData.kpseaYear = parseInt(data.kpseaYear);
if (data.kpseaIndex) updateData.kpseaIndex = data.kpseaIndex;
if (data.kpseaMarks) updateData.kpseaMarks = parseInt(data.kpseaMarks);
if (data.kjseaGrade) updateData.kjseaGrade = data.kjseaGrade;

// Also update old fields for backward compatibility
if (data.kpseaYear) updateData.kcpeYear = parseInt(data.kpseaYear);
if (data.kpseaIndex) updateData.kcpeIndex = data.kpseaIndex;
if (data.kpseaMarks) updateData.kcpeMarks = parseInt(data.kpseaMarks);
if (data.kjseaGrade) updateData.meanGrade = data.kjseaGrade;
    
    // Update status and related fields
    if (data.status) {
      updateData.status = data.status;
      
      // Handle status-specific updates
      if (data.status === 'ACCEPTED' || data.status === 'CONDITIONAL_ACCEPTANCE') {
        updateData.decisionDate = new Date();
        updateData.admissionOfficer = auth.user.name || 'System';
        if (data.decisionNotes) updateData.decisionNotes = data.decisionNotes;
        
        if (data.assignedStream) updateData.assignedStream = data.assignedStream;
        if (data.admissionClass) updateData.admissionClass = data.admissionClass;
        if (data.houseAssigned) updateData.houseAssigned = data.houseAssigned;
        if (data.reportingDate) updateData.reportingDate = new Date(data.reportingDate);
        if (data.admissionDate) updateData.admissionDate = new Date(data.admissionDate);
        
        if (data.status === 'CONDITIONAL_ACCEPTANCE') {
          if (data.conditions) updateData.conditions = data.conditions;
          if (data.conditionDeadline) updateData.conditionDeadline = new Date(data.conditionDeadline);
        }
      }
      
      else if (data.status === 'REJECTED') {
        updateData.rejectionDate = new Date();
        updateData.rejectionReason = data.rejectionReason || null;
        updateData.alternativeSuggestions = data.alternativeSuggestions || null;
        updateData.decisionNotes = data.decisionNotes || null;
        updateData.admissionOfficer = auth.user.name || 'System';
      }
      
      else if (data.status === 'WAITLISTED') {
        updateData.waitlistPosition = data.waitlistPosition || null;
        updateData.waitlistNotes = data.waitlistNotes || null;
        updateData.decisionNotes = data.decisionNotes || null;
        updateData.admissionOfficer = auth.user.name || 'System';
      }
      
      else if (data.status === 'INTERVIEW_SCHEDULED' || data.status === 'INTERVIEWED') {
        if (data.interviewDate) updateData.interviewDate = new Date(data.interviewDate);
        if (data.interviewTime) updateData.interviewTime = data.interviewTime;
        if (data.interviewVenue) updateData.interviewVenue = data.interviewVenue;
        if (data.interviewNotes) updateData.interviewNotes = data.interviewNotes;
        updateData.admissionOfficer = auth.user.name || 'System';
        
        if (data.status === 'INTERVIEWED') {
          updateData.decisionNotes = data.decisionNotes || null;
        }
      }
    }

    // Update other fields
    if (data.decisionNotes !== undefined) updateData.decisionNotes = data.decisionNotes;
    if (data.admissionOfficer !== undefined) updateData.admissionOfficer = auth.user.name;
    if (data.documentsVerified !== undefined) updateData.documentsVerified = data.documentsVerified;
    if (data.documentsNotes !== undefined) updateData.documentsNotes = data.documentsNotes;

    // Update the application
    const updatedApplication = await prisma.admissionApplication.update({
      where: { id },
      data: updateData,
    });

    // Send status update email if status changed
    if (data.status && data.status !== existingApplication.status) {
      try {
        const mailOptions = {
          from: {
            name: `${SCHOOL_NAME} Admissions`,
            address: process.env.EMAIL_USER
          },
          to: updatedApplication.email,
          subject: `Application Status Update: ${SCHOOL_NAME}`,
          html: getStatusUpdateTemplate(updatedApplication, data.status, data)
        };
        
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.warn("Status update email failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application updated successfully`,
      data: {
        id: updatedApplication.id,
        applicationNumber: updatedApplication.applicationNumber,
        name: `${updatedApplication.firstName} ${updatedApplication.lastName}`,
        status: getStatusLabel(updatedApplication.status),
        updatedAt: updatedApplication.updatedAt,
        updatedBy: auth.user.name
      }
    });

  } catch (error) {
    console.error("Update error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// DELETE HANDLER - DELETE APPLICATION (PROTECTED)
// ====================================================================

export async function DELETE(req) {
  try {
    // Step 1: Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Application deletion request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Check if application exists
    const application = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Get deletion reason from request body
    const data = await req.json().catch(() => ({}));
    const deletedBy = auth.user.name || 'System Administrator';
    const reason = data.reason || 'Administrative action';

    // Store application data before deletion for notification
    const applicationData = { ...application };

    // Delete the application
    await prisma.admissionApplication.delete({
      where: { id }
    });

    // Send deletion notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const deletionMailOptions = {
          from: {
            name: `${SCHOOL_NAME} Admissions System`,
            address: process.env.EMAIL_USER
          },
          to: adminEmail,
          subject: `🗑️ APPLICATION DELETED: ${applicationData.firstName} ${applicationData.lastName} (${applicationData.applicationNumber})`,
          html: getDeletionNotificationTemplate(applicationData, deletedBy)
        };
        
        await transporter.sendMail(deletionMailOptions);
      }
    } catch (emailError) {
      console.warn("Deletion notification email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Application deleted successfully`,
      data: {
        applicationNumber: applicationData.applicationNumber,
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        deletedAt: new Date().toISOString(),
        deletedBy: deletedBy,
        reason: reason
      }
    });

  } catch (error) {
    console.error("Delete error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
