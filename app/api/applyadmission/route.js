import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
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
const SCHOOL_EMAIL = 'kinyuiboys2015@gmail.com';
// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

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
  if (!phone || phone.trim() === '') return true; // Phone is now optional
  
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

// ====================================================================
// EMAIL FUNCTIONS
// ====================================================================

async function sendApplicantConfirmation(toEmail, applicantName, applicationNumber) {
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Admissions`,
      address: process.env.EMAIL_USER
    },
    to: toEmail,
    subject: `✅ Application Received: ${SCHOOL_NAME} - ${applicantName}`,
    html: `
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
                
                <!-- GREETING -->
                <tr>
                  <td style="padding: 8% 6% 2%;">
                    <p style="color: #334155; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 12px;">
                      Dear Parent/Guardian,
                    </p>
                    <p style="color: #475569; font-size: clamp(13px, 3.2vw, 15px); margin: 0; line-height: 1.7;">
                      Thank you for submitting an admission application to <strong style="color: #0f172a;">${SCHOOL_NAME}</strong>. 
                      We have successfully received the application for <strong style="color: #0f172a;">${applicantName}</strong>. 
                      Your application is now under review by our admissions team.
                    </p>
                  </td>
                </tr>
                
                <!-- DIVIDER -->
                <tr>
                  <td style="padding: 4% 6%;">
                    <div style="height: 1px; background: #e2e8f0;"></div>
                  </td>
                </tr>
                
                <!-- APPLICANT NAME CARD -->
                <tr>
                  <td style="padding: 0 6% 4%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; border: 1px solid #a7f3d0; border-left: 4px solid #059669;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px;">📝 Applicant Name</p>
                          <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #047857; margin: 0; word-break: break-word; line-height: 1.3;">${applicantName}</p>
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
                          <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #0c4a6e; margin: 0; word-break: break-word; line-height: 1.3;">${applicationNumber}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- IMPORTANT INFORMATION -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #fde68a; border-left: 4px solid #f59e0b;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="color: #92400e; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 12px;">⚠️ Important Information</p>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 5px 0; color: #78350f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">
                                <span style="color: #d97706; font-weight: 700; margin-right: 6px;">&#8226;</span> Please keep your <strong>Application Number (${applicationNumber})</strong> for future reference and inquiries.
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 5px 0; color: #78350f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">
                                <span style="color: #d97706; font-weight: 700; margin-right: 6px;">&#8226;</span> All further communications will be sent to: <strong>${toEmail}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 5px 0; color: #78350f; font-size: clamp(12px, 3vw, 13px); line-height: 1.6;">
                                <span style="color: #d97706; font-weight: 700; margin-right: 6px;">&#8226;</span> Check your inbox regularly, including the spam folder, for application status updates.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- SCHOOL INFO -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #64748b;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 10px;">About ${SCHOOL_NAME}</p>
                          <p style="color: #475569; font-size: clamp(12px, 3vw, 13px); margin: 0; line-height: 1.7;">
                            ${SCHOOL_NAME} is a Public Boy's Boarding School located in ${SCHOOL_LOCATION}. 
                            We provide quality education to 400+ students through the 8-4-4 and CBC curriculum system. 
                            Our motto is "<strong>${SCHOOL_MOTTO}</strong>".
                          </p>
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
                          <p style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 14px;">📞 Contact Our Admissions Office</p>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="width: 32px; vertical-align: middle;">
                                      <div style="background: #059669; color: white; width: 28px; height: 28px; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px;">☎</div>
                                    </td>
                                    <td style="padding-left: 12px; color: #334155; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600;">
                                      <a href="tel:${CONTACT_PHONE}" style="color: #334155; text-decoration: none;">${CONTACT_PHONE}</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="width: 32px; vertical-align: middle;">
                                      <div style="background: #d97706; color: white; width: 28px; height: 28px; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px;">✉</div>
                                    </td>
                                    <td style="padding-left: 12px; color: #334155; font-size: clamp(13px, 3.2vw, 14px); font-weight: 600;">
                                      <a href="mailto:${SCHOOL_EMAIL}" style="color: #334155; text-decoration: none;">${SCHOOL_EMAIL}</a>
                                    </td>
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
                
                <!-- STATUS CARD -->
                <tr>
                  <td style="padding: 0 6% 6%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #0f172a 0%, #334155 100%); border-radius: 12px;">
                      <tr>
                        <td style="padding: 6%; text-align: center;">
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 6px;">Your application status:</p>
                          <p style="color: #fbbf24; font-size: clamp(16px, 4.2vw, 20px); font-weight: 800; margin: 0;">🟡 Pending Review</p>
                          <p style="color: #64748b; font-size: clamp(11px, 2.8vw, 12px); margin: 10px 0 0; font-style: italic;">We will notify you of any updates within 2-4 weeks</p>
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
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 4px;">"${SCHOOL_MOTTO}"</p>
                          <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 0 0 14px;">${SCHOOL_LOCATION}</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <div style="width: 40px; height: 2px; background: #475569; margin: 0 auto 12px;"></div>
                          <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">This is an automated message. Please do not reply directly to this email.</p>
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

  await transporter.sendMail(mailOptions);
}

async function sendAdminNotification(applicantData, applicationNumber) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("⚠️ ADMIN_EMAIL is not set in environment variables. Admin notification skipped.");
    return;
  }

  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Admissions System`,
      address: process.env.EMAIL_USER
    },
    to: adminEmail,
    subject: `🚨 NEW APPLICATION SUBMITTED: ${applicantData.firstName} ${applicantData.lastName} (${applicationNumber})`,
    html: `
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
                            <span style="font-size: 28px;">🔔</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: white; font-size: clamp(18px, 5vw, 24px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">New Application Received!</h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 4px 0 0; font-weight: 500;">${SCHOOL_NAME} | ${SCHOOL_LOCATION}</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 10px;">
                          <span style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 5px 18px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #fecaca;">&#9888; Requires Review</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- APPLICATION NUMBER CARD -->
                <tr>
                  <td style="padding: 6% 6% 4%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; border-left: 4px solid #0284c7;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; color: #075985; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px;">Application Number</p>
                          <p style="font-size: clamp(18px, 4.8vw, 22px); font-weight: 800; color: #0c4a6e; margin: 0; word-break: break-word; line-height: 1.3;">${applicationNumber}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- PERSONAL INFORMATION SECTION -->
                <tr>
                  <td style="padding: 0 6% 2%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 10px; border-bottom: 2px solid #fee2e2;">
                          <p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #b91c1c; margin: 0;">👤 Personal Information</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2% 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Full Name</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569; word-break: break-word;">${applicantData.firstName} ${applicantData.middleName ? applicantData.middleName + ' ' : ''}${applicantData.lastName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Date of Birth</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${new Date(applicantData.dateOfBirth).toLocaleDateString()} (Age: ${calculateAge(applicantData.dateOfBirth)})</td>
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
                        <td style="padding: 10px 14px; background: #f8fafc; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">County</td>
                        <td style="padding: 10px 14px; background: #ffffff; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.county}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CBC ASSESSMENT RESULTS SECTION -->
                <tr>
                  <td style="padding: 0 6% 2%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 10px; border-bottom: 2px solid #fee2e2;">
                          <p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #b91c1c; margin: 0;">🎓 CBC Assessment Results</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2% 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Previous School</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.previousSchool}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Previous Grade</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.previousClass}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">KPSEA Year</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.kpseaYear || applicantData.kcpeYear || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Assessment Number</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.kpseaIndex || applicantData.kcpeIndex || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">KPSEA Score</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${(applicantData.kpseaMarks || applicantData.kcpeMarks) ? `${applicantData.kpseaMarks || applicantData.kcpeMarks}/100` : 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">KJSEA Grade</td>
                        <td style="padding: 10px 14px; background: #ffffff; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.kjseaGrade || applicantData.meanGrade || 'Not provided'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CONTACT INFORMATION SECTION -->
                <tr>
                  <td style="padding: 0 6% 2%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 10px; border-bottom: 2px solid #fee2e2;">
                          <p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #b91c1c; margin: 0;">📞 Contact Information</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2% 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Email</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569; word-break: break-word;">${applicantData.email || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Phone</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.phone || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">County</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.county}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Postal Address</td>
                        <td style="padding: 10px 14px; background: #ffffff; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.postalAddress}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- MEDICAL INFORMATION SECTION -->
                <tr>
                  <td style="padding: 0 6% 2%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 10px; border-bottom: 2px solid #fee2e2;">
                          <p style="font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: #b91c1c; margin: 0;">🏥 Medical Information</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2% 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Blood Group</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.bloodGroup || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Medical Condition</td>
                        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.medicalCondition || 'None reported'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 14px; background: #f8fafc; font-size: clamp(12px, 3vw, 13px); font-weight: 700; color: #0f172a; width: 40%;">Allergies</td>
                        <td style="padding: 10px 14px; background: #ffffff; font-size: clamp(12px, 3vw, 13px); color: #475569;">${applicantData.allergies || 'None reported'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- ACTION ALERT -->
                <tr>
                  <td style="padding: 0 6% 5%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 1px solid #fecaca; border-left: 4px solid #dc2626;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="color: #991b1b; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 8px;">⚠️ Action Required</p>
                          <p style="color: #7f1d1d; font-size: clamp(12px, 3vw, 13px); margin: 0; line-height: 1.7;">
                            Please log into the admissions portal to review and process this application.
                            Mark as under review, schedule an interview, or take appropriate action.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- SCHOOL DETAILS -->
                <tr>
                  <td style="padding: 0 6% 6%;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; border: 1px solid #a7f3d0; border-left: 4px solid #059669;">
                      <tr>
                        <td style="padding: 5%;">
                          <p style="font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px;">School Details</p>
                          <p style="font-size: clamp(15px, 4vw, 17px); font-weight: 800; color: #047857; margin: 0 0 8px;">${SCHOOL_NAME}</p>
                          <p style="font-size: clamp(12px, 3vw, 13px); color: #475569; margin: 0; line-height: 1.7;">
                            Location: ${SCHOOL_LOCATION}<br>
                            Motto: "${SCHOOL_MOTTO}"<br>
                            Phone: ${CONTACT_PHONE}
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
                          <p style="color: #ffffff; font-size: clamp(12px, 3vw, 13px); font-weight: 600; margin: 0 0 4px;">&copy; ${new Date().getFullYear()} ${SCHOOL_NAME} Admissions System</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <div style="width: 40px; height: 2px; background: #475569; margin: 10px auto;"></div>
                          <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">This is an automated notification. Please do not reply to this email.</p>
                          <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">${SCHOOL_LOCATION}</p>
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

  await transporter.sendMail(mailOptions);
}

// ====================================================================
// POST HANDLER - CREATE APPLICATION
// ====================================================================

export async function POST(req) {
  try {
    const data = await req.json();

    // 1. VALIDATION
    const requiredFields = [
      'firstName', 'lastName', 'gender', 'dateOfBirth',
      'nationality', 'county', 'constituency', 'ward',
      'postalAddress',
      'previousSchool', 'previousClass'
    ];

    const missingFields = requiredFields.filter(field => !data[field]?.trim());
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Email validation (email is now optional, but validate if provided)
    if (data.email && data.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
      }
      
  
    }

    // Phone validation (phone is now optional, but validate if provided)
    if (data.phone && data.phone.trim() !== '') {
      if (!validatePhone(data.phone)) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid phone format. Use 07XXXXXXXX or 01XXXXXXXX (or leave empty)" 
        }, { status: 400 });
      }
    }

    // Validate KPSEA marks (0-100)
if (data.kpseaMarks && data.kpseaMarks.trim() !== '') {
  const marks = parseInt(data.kpseaMarks);
  if (isNaN(marks) || marks < 0 || marks > 100) {
    return NextResponse.json({ 
      success: false, 
      error: "KPSEA marks must be between 0 and 100" 
    }, { status: 400 });
  }
}

// Validate KJSEA grade format (optional)
if (data.kjseaGrade && data.kjseaGrade.trim() !== '') {
  const validGrades = ['7 - ADV', '6 - PRF', '5 - DEV', '4 - APR', '3 - NOV', '2 - BEG', '1 - N/A'];
  if (!validGrades.includes(data.kjseaGrade)) {
    return NextResponse.json({ 
      success: false, 
      error: "Invalid KJSEA grade format" 
    }, { status: 400 });
  }
}

    // 2. PREPARE DATA
    const applicationNumber = generateApplicationNumber();

    const applicationData = {
      applicationNumber,
      // Personal
      firstName: data.firstName.trim(),
      middleName: data.middleName?.trim(),
      lastName: data.lastName.trim(),
      gender: data.gender,
      dateOfBirth: new Date(data.dateOfBirth),
      nationality: data.nationality.trim(),
      county: data.county.trim(),
      constituency: data.constituency.trim(),
      ward: data.ward.trim(),
      village: data.village?.trim(),
      
      // Contact
      email: data.email ? data.email.trim().toLowerCase() : null,
      phone: data.phone ? data.phone.replace(/\s/g, '') : null,
      alternativePhone: data.alternativePhone?.replace(/\s/g, ''),
      postalAddress: data.postalAddress.trim(),
      postalCode: data.postalCode?.trim(),
      
      // Parent/Guardian
      fatherName: data.fatherName?.trim(),
      fatherPhone: data.fatherPhone?.replace(/\s/g, ''),
      fatherEmail: data.fatherEmail?.trim().toLowerCase(),
      fatherOccupation: data.fatherOccupation?.trim(),
      motherName: data.motherName?.trim(),
      motherPhone: data.motherPhone?.replace(/\s/g, ''),
      motherEmail: data.motherEmail?.trim().toLowerCase(),
      motherOccupation: data.motherOccupation?.trim(),
      guardianName: data.guardianName?.trim(),
      guardianPhone: data.guardianPhone?.replace(/\s/g, ''),
      guardianEmail: data.guardianEmail?.trim().toLowerCase(),
      guardianOccupation: data.guardianOccupation?.trim(),
      
    // Academic - CBC System


// Academic - CBC System
previousSchool: data.previousSchool.trim(),
previousClass: data.previousClass.trim(),

// CBC fields - USE ONLY THESE (remove all duplicates)
kpseaYear: data.kpseaYear ? parseInt(data.kpseaYear) : null,
kpseaIndex: data.kpseaIndex?.trim(),
kpseaMarks: data.kpseaMarks ? parseInt(data.kpseaMarks) : null,
kjseaGrade: data.kjseaGrade?.trim(),
      // Medical
      medicalCondition: data.medicalCondition?.trim(),
      allergies: data.allergies?.trim(),
      bloodGroup: data.bloodGroup?.trim(),
      
      // Extracurricular
      sportsInterests: data.sportsInterests?.trim(),
      clubsInterests: data.clubsInterests?.trim(),
      talents: data.talents?.trim(),
      
      // Status (default)
      status: 'PENDING'
    };

    // 3. CREATE APPLICATION
    const application = await prisma.admissionApplication.create({
      data: applicationData
    });

    // 4. SEND EMAILS
    try {
      const fullName = `${application.firstName} ${application.lastName}`;
      // Only send confirmation email if email was provided
      if (application.email) {
        await sendApplicantConfirmation(application.email, fullName, application.applicationNumber);
      }
      await sendAdminNotification(application, application.applicationNumber);
    } catch (emailError) {
      console.warn("Email sending failed:", emailError);
      // Don't fail the request
    }

    // 5. RETURN RESPONSE
    return NextResponse.json({
      success: true,
      applicationNumber: application.applicationNumber,
      message: `Application submitted successfully to ${SCHOOL_NAME}`,
      data: {
        id: application.id,
        name: `${application.firstName} ${application.lastName}`,
        email: application.email,
        phone: application.phone,
        submittedAt: application.createdAt
      }
    });

  } catch (error) {
    console.error("Application error:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "Duplicate entry detected" },
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
// GET HANDLER - GET ALL APPLICATIONS
// ====================================================================

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Check if there are query parameters for filtering
    const applicationNumber = searchParams.get('applicationNumber');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    let applications;
    
 // If searching by specific criteria
if (applicationNumber) {
  applications = await prisma.admissionApplication.findUnique({
    where: { applicationNumber }
  });
  applications = applications ? [applications] : [];
} 
else if (email) {
  // ✅ FIXED: Use findMany for email since it's not unique
  applications = await prisma.admissionApplication.findMany({
    where: { email: email },
    orderBy: { createdAt: "desc" }
  });
}
else if (phone) {
  applications = await prisma.admissionApplication.findMany({
    where: { phone: { contains: phone } },
    orderBy: { createdAt: "desc" }
  });
}
else {
  // Get all applications
  applications = await prisma.admissionApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
}

    // Format the applications
    const formattedApplications = applications.map(app => ({
      id: app.id,
      applicationNumber: app.applicationNumber,
      
      // Personal Information
      firstName: app.firstName,
      middleName: app.middleName,
      lastName: app.lastName,
      gender: app.gender,
      dateOfBirth: app.dateOfBirth.toISOString().split('T')[0],
      nationality: app.nationality,
      county: app.county,
      constituency: app.constituency,
      ward: app.ward,
      village: app.village,
      
      // Contact Information
      email: app.email,
      phone: app.phone,
      alternativePhone: app.alternativePhone,
      postalAddress: app.postalAddress,
      postalCode: app.postalCode,
      
      // Parent/Guardian
      fatherName: app.fatherName,
      fatherPhone: app.fatherPhone,
      fatherEmail: app.fatherEmail,
      fatherOccupation: app.fatherOccupation,
      motherName: app.motherName,
      motherPhone: app.motherPhone,
      motherEmail: app.motherEmail,
      motherOccupation: app.motherOccupation,
      guardianName: app.guardianName,
      guardianPhone: app.guardianPhone,
      guardianEmail: app.guardianEmail,
      guardianOccupation: app.guardianOccupation,
      
     // Academic - CBC System
previousSchool: app.previousSchool,
previousClass: app.previousClass,

// New CBC fields
kpseaYear: app.kpseaYear || app.kcpeYear,
kpseaIndex: app.kpseaIndex || app.kcpeIndex,
kpseaMarks: app.kpseaMarks || app.kcpeMarks,
kjseaGrade: app.kjseaGrade || app.meanGrade,

// Keep old fields for backward compatibility
kcpeYear: app.kcpeYear || app.kpseaYear,
kcpeIndex: app.kcpeIndex || app.kpseaIndex,
kcpeMarks: app.kcpeMarks || app.kpseaMarks,
meanGrade: app.meanGrade || app.kjseaGrade,
      
      // Medical
      medicalCondition: app.medicalCondition,
      allergies: app.allergies,
      bloodGroup: app.bloodGroup,
      
      // Extracurricular
      sportsInterests: app.sportsInterests,
      clubsInterests: app.clubsInterests,
      talents: app.talents,
      
      // Status
      status: app.status,
      decisionNotes: app.decisionNotes,
      admissionOfficer: app.admissionOfficer,
      decisionDate: app.decisionDate?.toISOString().split('T')[0],
      admissionDate: app.admissionDate?.toISOString().split('T')[0],
      assignedStream: app.assignedStream,
      reportingDate: app.reportingDate?.toISOString().split('T')[0],
      admissionLetterSent: app.admissionLetterSent,
      rejectionDate: app.rejectionDate?.toISOString().split('T')[0],
      rejectionReason: app.rejectionReason,
      alternativeSuggestions: app.alternativeSuggestions,
      waitlistPosition: app.waitlistPosition,
      waitlistNotes: app.waitlistNotes,
      interviewDate: app.interviewDate?.toISOString().split('T')[0],
      interviewTime: app.interviewTime,
      interviewVenue: app.interviewVenue,
      interviewNotes: app.interviewNotes,
      conditions: app.conditions,
      conditionDeadline: app.conditionDeadline?.toISOString().split('T')[0],
      houseAssigned: app.houseAssigned,
      admissionClass: app.admissionClass,
      admissionType: app.admissionType,
      documentsVerified: app.documentsVerified,
      documentsNotes: app.documentsNotes,
      
      // Computed fields
      fullName: `${app.firstName} ${app.middleName ? app.middleName + ' ' : ''}${app.lastName}`,
      age: calculateAge(app.dateOfBirth),
      statusLabel: getStatusLabel(app.status),
      school: SCHOOL_NAME,
      
      // Timestamps
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString()
    }));

    return NextResponse.json({ 
      success: true, 
      school: SCHOOL_NAME,
      location: SCHOOL_LOCATION,
      motto: SCHOOL_MOTTO,
      count: formattedApplications.length,
      applications: formattedApplications 
    });

  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch applications from ${SCHOOL_NAME}` },
      { status: 500 }
    );
  }
} 
