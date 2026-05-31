import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ====================================================================
// CONFIGURATION
// ====================================================================

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Missing email credentials in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add this to debug connection issues
  debug: true,
  logger: true
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const SCHOOL_NAME = 'kinyui boys Senior School';
const SCHOOL_LOCATION = 'Matungulu, Machakos County';
const SCHOOL_MOTTO = 'Soaring to Excellence';
const CONTACT_PHONE = '0790 789847';
const CONTACT_EMAIL = 'kinyuiboys2015@gmail.com';

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

function validatePhone(phone) {
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(07|01)\d{8}$/;
  return regex.test(cleaned);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function generateReferenceNumber() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TC-${year}${month}-${randomNum}`;
}

// ====================================================================
// EMAIL TEMPLATES
// ====================================================================

async function sendParentConfirmation(parentEmail, parentName, teacherName, referenceNumber) {
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} - Teacher Consultation`,
      address: process.env.EMAIL_USER
    },
    to: parentEmail,
    subject: `📧 Teacher Consultation Request Received - ${SCHOOL_NAME}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="x-apple-disable-message-reformatting">
        <title>Consultation Confirmation - ${SCHOOL_NAME}</title>
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
                            <span style="font-size: 28px;">📧</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: white; font-size: clamp(20px, 5.5vw, 26px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">Consultation Request</h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 4px 0 0; font-weight: 500;">${SCHOOL_NAME}</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 10px;">
                          <span style="display: inline-block; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); padding: 5px 18px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.9);">Teacher-Parent Communication</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- SUCCESS BANNER -->
                <tr>
                  <td style="padding: 6% 6% 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; border: 1px solid #a7f3d0;">
                      <tr>
                        <td style="padding: 5%; text-align: center;">
                          <span style="font-size: 36px;">✅</span>
                          <p style="color: #065f46; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 8px 0 0 0;">Your consultation request has been received!</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- GREETING & MESSAGE -->
                <tr>
                  <td style="padding: 6% 6% 2%;">
                    <p style="color: #334155; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 12px;">
                      Dear <strong style="color: #0f172a;">${parentName}</strong>,
                    </p>
                    <p style="color: #475569; font-size: clamp(13px, 3.2vw, 15px); margin: 0; line-height: 1.7;">
                      Thank you for reaching out to <strong style="color: #0f172a;">${teacherName}</strong>. Your consultation request has been successfully submitted and will be reviewed shortly.
                    </p>
                  </td>
                </tr>
                
                <!-- DIVIDER -->
                <tr>
                  <td style="padding: 4% 6%;">
                    <div style="height: 1px; background: #e2e8f0;"></div>
                  </td>
                </tr>
                
                <!-- REFERENCE CARD -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #0284c7;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px;">Reference Number</p>
                          <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #0c4a6e; margin: 0;">${referenceNumber}</p>
                          <p style="font-size: clamp(10px, 2.5vw, 11px); color: #94a3b8; margin: 8px 0 0; font-style: italic;">Please keep this for your records</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- WHAT HAPPENS NEXT -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <p style="color: #0f172a; font-size: clamp(15px, 4vw, 18px); font-weight: 700; margin: 0 0 14px;">📋 What Happens Next?</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                      <tr>
                        <td style="padding: 5%;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                                <div style="background: #0f172a; color: white; width: 26px; height: 26px; border-radius: 50%; text-align: center; line-height: 26px; font-size: 12px; font-weight: 700;">1</div>
                              </td>
                              <td style="padding: 8px 0 8px 12px; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                                <strong>Teacher Review:</strong> ${teacherName} will review your consultation request
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                                <div style="background: #0f172a; color: white; width: 26px; height: 26px; border-radius: 50%; text-align: center; line-height: 26px; font-size: 12px; font-weight: 700;">2</div>
                              </td>
                              <td style="padding: 8px 0 8px 12px; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                                <strong>Response Time:</strong> You'll receive a response within 24-48 hours
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                                <div style="background: #0f172a; color: white; width: 26px; height: 26px; border-radius: 50%; text-align: center; line-height: 26px; font-size: 12px; font-weight: 700;">3</div>
                              </td>
                              <td style="padding: 8px 0 8px 12px; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                                <strong>Follow-up:</strong> The teacher will contact you via your preferred method
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CONTACT OPTIONS -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #fde68a;">
                      <tr>
                        <td style="padding: 5%; text-align: center;">
                          <p style="color: #92400e; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; margin: 0 0 14px;">📞 Need Immediate Assistance?</p>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tr>
                              <td style="padding: 0 6px;">
                                <a href="tel:${CONTACT_PHONE}" style="display: inline-block; background: #0f172a; color: white; padding: 10px 22px; border-radius: 10px; text-decoration: none; font-size: clamp(12px, 3vw, 14px); font-weight: 600;">Call School</a>
                              </td>
                              <td style="padding: 0 6px;">
                                <a href="mailto:${CONTACT_EMAIL}" style="display: inline-block; background: #475569; color: white; padding: 10px 22px; border-radius: 10px; text-decoration: none; font-size: clamp(12px, 3vw, 14px); font-weight: 600;">Email Office</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- NOTICE -->
                <tr>
                  <td style="padding: 0 6% 6%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <tr>
                        <td style="padding: 4%; text-align: center;">
                          <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin: 0; font-style: italic;">
                            This is an automated confirmation. Please do not reply to this email.
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
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">${SCHOOL_MOTTO}</p>
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 14px;">${SCHOOL_LOCATION}</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 14px;">
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">
                            <a href="mailto:${CONTACT_EMAIL}" style="color: #94a3b8; text-decoration: none;">${CONTACT_EMAIL}</a>
                          </p>
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0;">
                            <a href="tel:${CONTACT_PHONE}" style="color: #94a3b8; text-decoration: none;">${CONTACT_PHONE}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <div style="width: 40px; height: 2px; background: #475569; margin: 0 auto 12px;"></div>
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
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Parent confirmation email sent to ${parentEmail}`);
  } catch (error) {
    console.error('Error sending parent email:', error);
    throw new Error('Failed to send parent confirmation');
  }
}

async function sendTeacherNotification(teacherEmail, teacherName, parentData, referenceNumber) {
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} - Parent Communication`,
      address: process.env.EMAIL_USER
    },
    to: teacherEmail,
    subject: `📩 New Consultation Request from Parent - ${referenceNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="x-apple-disable-message-reformatting">
        <title>New Consultation Request - ${SCHOOL_NAME}</title>
      </head>
      <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; line-height: 1.6; color: #1e293b; -webkit-text-size-adjust: 100%;">
        
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f1f5f9;">
          <tr>
            <td align="center" style="padding: 4% 3%;">
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15,23,42,0.08);">
                
                <!-- HEADER -->
                <tr>
                  <td style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%); padding: 10% 6% 8%; text-align: center;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding-bottom: 10px;">
                          <div style="display: inline-block; background: rgba(255,255,255,0.1); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; text-align: center;">
                            <span style="font-size: 28px;">📩</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: white; font-size: clamp(18px, 5vw, 24px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em; text-transform: uppercase;">New Consultation Request</h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 10px;">
                          <span style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 5px 18px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.95);">⚡ Action Required</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- ALERT BANNER -->
                <tr>
                  <td style="padding: 6% 6% 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 1px solid #fecaca;">
                      <tr>
                        <td style="padding: 5%; text-align: center;">
                          <span style="font-size: 32px;">👋</span>
                          <p style="color: #991b1b; font-size: clamp(13px, 3.2vw, 15px); font-weight: 700; margin: 8px 0 0 0;">You have a new consultation request from a parent!</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- GREETING -->
                <tr>
                  <td style="padding: 6% 6% 2%;">
                    <p style="color: #334155; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 12px;">
                      Hello <strong style="color: #0f172a;">${teacherName}</strong>,
                    </p>
                    <p style="color: #475569; font-size: clamp(13px, 3.2vw, 15px); margin: 0; line-height: 1.7;">
                      A parent has requested a consultation with you. Please review the details below and respond within 24-48 hours.
                    </p>
                  </td>
                </tr>
                
                <!-- DIVIDER -->
                <tr>
                  <td style="padding: 4% 6%;">
                    <div style="height: 1px; background: #e2e8f0;"></div>
                  </td>
                </tr>
                
                <!-- REFERENCE CARD -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #dc2626;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px;">Reference Number</p>
                          <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #991b1b; margin: 0;">${referenceNumber}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- PARENT INFORMATION -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <p style="color: #0f172a; font-size: clamp(15px, 4vw, 18px); font-weight: 700; margin: 0 0 14px;">👨‍👩‍👧 Parent Information</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                      <tr>
                        <td style="padding: 5%;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="color: #64748b; font-size: clamp(12px, 3vw, 13px); font-weight: 700; width: 40%;">Name:</td>
                                    <td style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600;">${parentData.name}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="color: #64748b; font-size: clamp(12px, 3vw, 13px); font-weight: 700; width: 40%;">Email:</td>
                                    <td style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600; word-break: break-word;">${parentData.email}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="color: #64748b; font-size: clamp(12px, 3vw, 13px); font-weight: 700; width: 40%;">Phone:</td>
                                    <td style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600;">${parentData.phone}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            ${parentData.studentDetails ? `
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="color: #64748b; font-size: clamp(12px, 3vw, 13px); font-weight: 700; width: 40%;">Student:</td>
                                    <td style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600;">${parentData.studentDetails}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 10px 0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="color: #64748b; font-size: clamp(12px, 3vw, 13px); font-weight: 700; width: 40%;">Contact Pref:</td>
                                    <td style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600; text-transform: capitalize;">${parentData.contactMethod || 'email'}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- MESSAGE FROM PARENT -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <p style="color: #0f172a; font-size: clamp(15px, 4vw, 18px); font-weight: 700; margin: 0 0 14px;">💬 Message from Parent</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #fde68a; border-left: 4px solid #f59e0b;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="color: #92400e; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 8px;">Subject: ${parentData.subject}</p>
                          <p style="color: #78350f; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.7; margin: 0; white-space: pre-wrap;">${parentData.message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- ACTION BUTTONS -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 4px 0 0;" width="50%">
                          <a href="mailto:${parentData.email}" style="display: block; background: #0f172a; color: white; text-align: center; padding: 12px 8px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: clamp(12px, 3vw, 14px);">📧 Reply via Email</a>
                        </td>
                        ${parentData.contactMethod === 'phone' || parentData.contactMethod === 'whatsapp' ? `
                        <td style="padding: 0 0 0 4px;" width="50%">
                          <a href="tel:${parentData.phone}" style="display: block; background: #059669; color: white; text-align: center; padding: 12px 8px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: clamp(12px, 3vw, 14px);">📞 Call Parent</a>
                        </td>
                        ` : ''}
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- QUICK RESPONSE TIPS -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; border-left: 4px solid #0284c7;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="color: #0c4a6e; font-size: clamp(12px, 3vw, 13px); font-weight: 700; margin: 0 0 10px;">💡 Quick Response Tips:</p>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 4px 0; color: #075985; font-size: clamp(11px, 2.8vw, 12px); line-height: 1.5;">
                                <span style="color: #0284c7; font-weight: 700; margin-right: 6px;">&#8226;</span> Acknowledge receipt of the consultation request
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0; color: #075985; font-size: clamp(11px, 2.8vw, 12px); line-height: 1.5;">
                                <span style="color: #0284c7; font-weight: 700; margin-right: 6px;">&#8226;</span> Schedule a convenient time for follow-up
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0; color: #075985; font-size: clamp(11px, 2.8vw, 12px); line-height: 1.5;">
                                <span style="color: #0284c7; font-weight: 700; margin-right: 6px;">&#8226;</span> Address the parent's specific concerns
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0; color: #075985; font-size: clamp(11px, 2.8vw, 12px); line-height: 1.5;">
                                <span style="color: #0284c7; font-weight: 700; margin-right: 6px;">&#8226;</span> Keep the reference number for tracking
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- NOTICE -->
                <tr>
                  <td style="padding: 0 6% 6%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <tr>
                        <td style="padding: 4%; text-align: center;">
                          <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin: 0; font-style: italic;">
                            This is an automated notification from ${SCHOOL_NAME}.<br>Please respond to the parent within 24-48 hours.
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
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">${SCHOOL_MOTTO}</p>
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 14px;">${SCHOOL_LOCATION}</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 14px;">
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">
                            <a href="mailto:${CONTACT_EMAIL}" style="color: #94a3b8; text-decoration: none;">${CONTACT_EMAIL}</a>
                          </p>
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0;">
                            <a href="tel:${CONTACT_PHONE}" style="color: #94a3b8; text-decoration: none;">${CONTACT_PHONE}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <div style="width: 40px; height: 2px; background: #475569; margin: 0 auto 12px;"></div>
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
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Teacher notification sent to ${teacherEmail}`);
  } catch (error) {
    console.error('Error sending teacher email:', error);
    throw new Error('Failed to send teacher notification');
  }
}

// ====================================================================
// POST REQUEST HANDLER
// ====================================================================

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received consultation request:', { ...body, message: '[REDACTED]' });
    
    const { 
      name,           // Parent name
      email,          // Parent email
      phone,          // Parent phone
      message,        // Consultation message
      subject,        // Message subject
      studentDetails, // Student name/grade (optional)
      contactMethod,  // Preferred contact: email/phone/whatsapp
      teacherId,      // Teacher's ID
      teacherName,    // Teacher's name
      teacherEmail,   // Teacher's email
      teacherPosition // Teacher's position
    } = body;
    
    // Validation
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!message) missingFields.push('message');
    if (!subject) missingFields.push('subject');
    if (!teacherName) missingFields.push('teacherName');
    if (!teacherEmail) missingFields.push('teacherEmail');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }
    
    // Validate phone format
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use 07XXXXXXXX or 01XXXXXXXX' },
        { status: 400 }
      );
    }
    
    const referenceNumber = generateReferenceNumber();
    console.log(`Generated reference number: ${referenceNumber}`);
    
    // Send confirmation to parent
    await sendParentConfirmation(email, name, teacherName, referenceNumber);
    console.log('Parent confirmation email sent successfully');
    
    // Send notification to teacher
    await sendTeacherNotification(
      teacherEmail,
      teacherName,
      { name, email, phone, message, subject, studentDetails, contactMethod: contactMethod || 'email' },
      referenceNumber
    );
    console.log('Teacher notification email sent successfully');
    
    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Consultation request sent successfully',
        referenceNumber: referenceNumber
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Teacher consultation error:', error);
    
    // Return more specific error message
    return NextResponse.json(
      { 
        error: 'Failed to send consultation request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// OPTIONS HANDLER FOR CORS
// ====================================================================

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Allow': 'POST, OPTIONS',
      },
    }
  );
}
