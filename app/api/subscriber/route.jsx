import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import nodemailer from 'nodemailer';

// School Information
const SCHOOL_NAME = 'kinyui boys Senior School';
const SCHOOL_LOCATION = 'Matungulu, Machakos County';
const SCHOOL_MOTTO = 'Soaring to Excellence';
const CONTACT_PHONE = '0790 789847';
const CONTACT_EMAIL = 'kinyuiboys2015@gmail.com';

// Email Templates
const emailTemplates = {
  admin: ({ email }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="x-apple-disable-message-reformatting">
      <title>New Subscriber - ${SCHOOL_NAME}</title>
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
                          <span style="font-size: 26px;">📩</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: white; font-size: clamp(20px, 5.5vw, 26px); font-weight: 800; margin: 0 0 4px; line-height: 1.2; letter-spacing: -0.02em;">New Subscriber</h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 0; font-weight: 500;">${SCHOOL_NAME}</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 8px;">
                        <span style="display: inline-block; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); padding: 5px 16px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.9);">Newsletter Alert</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- TITLE -->
              <tr>
                <td style="padding: 8% 6% 2%;">
                  <h2 style="color: #0f172a; font-size: clamp(18px, 4.8vw, 22px); font-weight: 700; margin: 0 0 8px; line-height: 1.3; letter-spacing: -0.01em;">New Newsletter Subscriber</h2>
                  <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin: 0; letter-spacing: 0.03em;">
                    ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
              </tr>
              
              <!-- DIVIDER -->
              <tr>
                <td style="padding: 4% 6%;">
                  <div style="height: 1px; background: #e2e8f0;"></div>
                </td>
              </tr>
              
              <!-- SUBSCRIBER CARD -->
              <tr>
                <td style="padding: 0 6% 6%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; border-left: 4px solid #0284c7;">
                    <tr>
                      <td style="padding: 6%;">
                        <p style="color: #075985; font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">📧 Subscriber Email</p>
                        <p style="color: #0c4a6e; font-size: clamp(16px, 4.2vw, 20px); font-weight: 800; margin: 0; word-break: break-word; line-height: 1.4;">${email}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- SCHOOL INFO -->
              <tr>
                <td style="padding: 0 6% 6%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #64748b;">
                    <tr>
                      <td style="padding: 5%;">
                        <p style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 10px;">🏫 School Information</p>
                        <p style="color: #475569; font-size: clamp(12px, 3vw, 13px); margin: 0; line-height: 1.7;">
                          <strong>${SCHOOL_NAME}</strong><br>
                          ${SCHOOL_LOCATION}<br>
                          Public Boarding School &bull; 400+ Students &bull; 8-4-4 Curriculum
                        </p>
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
                          This is an automated notification from the ${SCHOOL_NAME} newsletter system.
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
  `,

  user: ({ email }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="x-apple-disable-message-reformatting">
      <title>Welcome - ${SCHOOL_NAME}</title>
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
                        <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 4px 0 0; font-weight: 500;">${SCHOOL_MOTTO}</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 10px;">
                        <span style="display: inline-block; background: rgba(34,197,94,0.2); border: 1px solid rgba(34,197,94,0.3); padding: 5px 18px; border-radius: 24px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #86efac;">&#10003; Subscription Confirmed</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- WELCOME MESSAGE -->
              <tr>
                <td style="padding: 8% 6% 2%;">
                  <h2 style="color: #0f172a; font-size: clamp(18px, 4.8vw, 24px); font-weight: 700; margin: 0 0 8px; line-height: 1.3; letter-spacing: -0.01em;">Welcome to Our Newsletter! 👋</h2>
                  <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 12px); margin: 0; letter-spacing: 0.03em;">
                    ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </td>
              </tr>
              
              <!-- DIVIDER -->
              <tr>
                <td style="padding: 4% 6%;">
                  <div style="height: 1px; background: #e2e8f0;"></div>
                </td>
              </tr>
              
              <!-- CONTENT -->
              <tr>
                <td style="padding: 0 6% 6%;">
                  <p style="color: #334155; font-size: clamp(14px, 3.5vw, 15px); line-height: 1.7; margin: 0;">
                    Thank you for subscribing to <strong style="color: #0f172a;">${SCHOOL_NAME}</strong> newsletter with email <strong style="color: #0f172a;">${email}</strong>. You'll now receive important school updates, announcements, events, and academic information from our Public Boarding School.
                  </p>
                </td>
              </tr>
              
              <!-- WHAT YOU'LL RECEIVE -->
              <tr>
                <td style="padding: 0 6% 6%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 1px solid #bae6fd; border-left: 4px solid #0284c7;">
                    <tr>
                      <td style="padding: 6%;">
                        <p style="color: #0c4a6e; font-size: clamp(14px, 3.5vw, 15px); font-weight: 700; margin: 0 0 14px;">📬 What you'll receive:</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 6px 0; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                              <span style="color: #0284c7; font-weight: 700; margin-right: 8px;">&#8226;</span> School announcements and updates
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                              <span style="color: #0284c7; font-weight: 700; margin-right: 8px;">&#8226;</span> Academic calendar and events
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                              <span style="color: #0284c7; font-weight: 700; margin-right: 8px;">&#8226;</span> Student achievements and news
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                              <span style="color: #0284c7; font-weight: 700; margin-right: 8px;">&#8226;</span> Important deadline reminders
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #334155; font-size: clamp(13px, 3.2vw, 14px); line-height: 1.5;">
                              <span style="color: #0284c7; font-weight: 700; margin-right: 8px;">&#8226;</span> Admission information
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- CONTACT CARD -->
              <tr>
                <td style="padding: 0 6% 6%;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 5%; text-align: center;">
                        <p style="color: #0f172a; font-size: clamp(13px, 3.2vw, 14px); font-weight: 700; margin: 0 0 10px;">📞 School Contacts</p>
                        <p style="color: #475569; font-size: clamp(13px, 3.2vw, 14px); margin: 0; line-height: 1.7;">
                          <strong>${CONTACT_PHONE}</strong> &bull;
                          <a href="mailto:${CONTACT_EMAIL}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${CONTACT_EMAIL}</a><br>
                          📍 ${SCHOOL_LOCATION}
                        </p>
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
                        <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">Public Boarding School &bull; 400+ Students</p>
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
  `,
};

// Helpers
const validateEnvironment = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(`❌ EMAIL_USER and EMAIL_PASS are not set for ${SCHOOL_NAME}.`);
    return false;
  }
  return true;
};

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Main POST
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Skip format validation intentionally
    if (!validateEnvironment()) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Check duplicates
    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });
    if (existingSubscriber) {
      return NextResponse.json({ 
        error: 'This email is already subscribed to our newsletter',
        school: SCHOOL_NAME 
      }, { status: 409 });
    }

    // Save subscriber - REMOVED school field from data creation
    const subscriber = await prisma.subscriber.create({
      data: { 
        email,
        // REMOVED: school: SCHOOL_NAME
      },
      select: { 
        id: true, 
        email: true, 
        createdAt: true,
        // REMOVED: school: true
      },
    });

    // Send emails
    const transporter = createTransporter();
    const adminMail = {
      from: `"${SCHOOL_NAME} Newsletter" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Newsletter Subscriber - ${SCHOOL_NAME}`,
      html: emailTemplates.admin({ email }),
    };
    const userMail = {
      from: `"${SCHOOL_NAME} Newsletter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🏫 Welcome to ${SCHOOL_NAME} Newsletter!`,
      html: emailTemplates.user({ email }),
    };

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(userMail),
    ]);

    console.log(`✅ New subscriber added to ${SCHOOL_NAME}: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully subscribed to ${SCHOOL_NAME} newsletter.`,
        subscriber: {
          ...subscriber,
          school: SCHOOL_NAME, // Still include school in response
          message: "You'll receive school updates and announcements"
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`❌ Error adding subscriber to ${SCHOOL_NAME}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to subscribe. Please try again.',
        school: SCHOOL_NAME
      },
      { status: 500 }
    );
  }
}

// GET subscribers
export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        email: true, 
        createdAt: true,
        // REMOVED: school: true 
      },
    });
    
    // Add school name to each subscriber in the response
    const subscribersWithSchool = subscribers.map(subscriber => ({
      ...subscriber,
      school: SCHOOL_NAME
    }));
    
    return NextResponse.json({ 
      success: true, 
      subscribers: subscribersWithSchool,
      school: SCHOOL_NAME,
      count: subscribers.length,
      schoolInfo: {
        name: SCHOOL_NAME,
        location: SCHOOL_LOCATION,
        motto: SCHOOL_MOTTO
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`❌ Error fetching subscribers for ${SCHOOL_NAME}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      school: SCHOOL_NAME 
    }, { status: 500 });
  }
}
