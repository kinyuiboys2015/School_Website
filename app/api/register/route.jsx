import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import { hashPassword, generateToken, sanitizeUser } from '../../../libs/auth';
import nodemailer from 'nodemailer';

// Constants
const SCHOOL_NAME = 'kinyui boys Senior School';
const SCHOOL_LOCATION = 'Matungulu, Machakos County';
const SCHOOL_MOTTO = 'Soaring to Excellence';
const CONTACT_PHONE = '0790 789847';
const CONTACT_EMAIL = 'kinyuiboys2015@gmail.com';

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ====================================================================
// EMAIL TEMPLATE - REGISTRATION SUCCESS
// ====================================================================
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
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f5f5f5; color:#1f2937; line-height:1.6;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5; padding:24px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border:1px solid #e5e7eb;">
                      <tr>
                        <td style="padding:24px; background:#111827; color:#ffffff; text-align:center;">
                          <h1 style="margin:0; font-size:22px; font-weight:700;">${SCHOOL_NAME}</h1>
                          <p style="margin:8px 0 0; font-size:14px;">Administrator Account Registration</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:24px;">
                          <h2 style="margin:0 0 12px; font-size:18px; color:#111827;">Administrator account created successfully.</h2>
                          <p style="margin:0 0 16px; font-size:14px; color:#374151;">
                            Welcome to the platform. Your administrator account has been registered successfully.
                          </p>
                          <p style="margin:0 0 16px; font-size:14px; color:#374151;">
                            Dear ${user.name}, your account is now active and you can access the dashboard using your registered email.
                          </p>

                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb; margin:0 0 16px;">
                            <tr>
                              <td style="padding:10px; width:35%; font-size:13px; color:#6b7280; border-bottom:1px solid #e5e7eb;">Role</td>
                              <td style="padding:10px; font-size:13px; color:#111827; border-bottom:1px solid #e5e7eb;">${user.role}</td>
                            </tr>
                            <tr>
                              <td style="padding:10px; width:35%; font-size:13px; color:#6b7280;">Email</td>
                              <td style="padding:10px; font-size:13px; color:#111827;">${user.email}</td>
                            </tr>
                          </table>

                          <p style="margin:0 0 10px; font-size:14px; color:#374151;">
                            Dashboard URL:
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://kinyuiboyssenior.school'}/MainDashboard" style="color:#1d4ed8; text-decoration:none;">
                              Open Dashboard
                            </a>
                          </p>
                          <p style="margin:0; font-size:13px; color:#6b7280;">
                            Keep your login credentials secure and do not share them.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:18px 24px; background:#f9fafb; border-top:1px solid #e5e7eb; font-size:12px; color:#6b7280; text-align:center;">
                          <p style="margin:0 0 6px;">${SCHOOL_LOCATION}</p>
                          <p style="margin:0 0 6px;">${SCHOOL_MOTTO}</p>
                          <p style="margin:0;">${CONTACT_PHONE} | ${CONTACT_EMAIL}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: clamp(13px, 3.2vw, 14px); color: #334155; line-height: 1.5;">
                              <span style="font-size: 18px; margin-right: 8px; vertical-align: middle;">⚙️</span>
                              <strong>System Settings:</strong> Configure school information and policies
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; font-size: clamp(13px, 3.2vw, 14px); color: #334155; line-height: 1.5;">
                              <span style="font-size: 18px; margin-right: 8px; vertical-align: middle;">📊</span>
                              <strong>Reports:</strong> Generate and view school reports
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 6%;">
                    <tr>
                      <td style="padding: 6% 5%; text-align: center;">
                        <h3 style="color: #0f172a; font-size: clamp(15px, 3.8vw, 16px); font-weight: 700; margin: 0 0 8px;">🚀 Get Started Now</h3>
                        <p style="margin: 0 0 16px; font-size: clamp(13px, 3.2vw, 14px); color: #475569;">Access your dashboard and start managing the school system</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://kinyuiboyssenior.school'}/MainDashboard" 
                           style="display: inline-block; 
                                  width: 80%; 
                                  max-width: 260px; 
                                  background: linear-gradient(135deg, #0f172a 0%, #334155 100%); 
                                  color: white; 
                                  padding: 14px 8px; 
                                  text-decoration: none; 
                                  border-radius: 8px; 
                                  font-weight: 600; 
                                  font-size: clamp(14px, 3.5vw, 15px); 
                                  text-align: center;
                                  border: none;">Open Dashboard →</a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Credentials Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #64748b; margin-bottom: 6%;">
                    <tr>
                      <td style="padding: 5% 5%;">
                        <h3 style="color: #0f172a; font-size: clamp(14px, 3.5vw, 15px); font-weight: 700; margin: 0 0 4%;">🔐 Login Information</h3>
                        
                        <!-- Email credential -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border-radius: 8px; border-left: 4px solid #475569; margin-bottom: 10px;">
                          <tr>
                            <td style="padding: 12px;">
                              <p style="font-size: clamp(10px, 2.5vw, 11px); color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 4px;">📧 Email</p>
                              <p style="font-size: clamp(13px, 3.2vw, 14px); color: #1e293b; font-weight: 700; margin: 0; word-break: break-word;">${user.email}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Password credential -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border-radius: 8px; border-left: 4px solid #475569;">
                          <tr>
                            <td style="padding: 12px;">
                              <p style="font-size: clamp(10px, 2.5vw, 11px); color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 4px;">🔑 Password</p>
                              <p style="font-size: clamp(13px, 3.2vw, 14px); color: #1e293b; font-weight: 700; margin: 0;">Use the password you set during registration</p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 12px 0 0; font-size: clamp(11px, 2.8vw, 12px); color: #475569;">
                          ⚠️ <strong>Important:</strong> Keep your login credentials safe and never share them with anyone.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Support Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #475569; margin-bottom: 6%;">
                    <tr>
                      <td style="padding: 5% 5%;">
                        <h3 style="color: #0f172a; font-size: clamp(14px, 3.5vw, 15px); font-weight: 700; margin: 0 0 3%;">💡 Need Help?</h3>
                        <p style="font-size: clamp(12px, 3vw, 13px); color: #475569; line-height: 1.6; margin: 0;">
                          If you have any questions or need assistance with the dashboard, please contact the IT department or school administrator at <strong>${CONTACT_EMAIL}</strong> or <strong>${CONTACT_PHONE}</strong>.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Closing Message -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="text-align: center; padding-top: 4%; border-top: 2px solid #e2e8f0;">
                        <p style="font-size: clamp(15px, 3.8vw, 16px); color: #0f172a; font-weight: 600; margin: 0 0 6px;">
                          Thank you for joining our team!
                        </p>
                        <p style="font-size: clamp(13px, 3.2vw, 14px); color: #475569; margin: 0;">
                          Together, we are making a difference in education.<br>
                          <strong style="color: #334155;">${SCHOOL_MOTTO}</strong>
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- FOOTER -->
              <tr>
                <td style="background: #0f172a; padding: 8% 6%; text-align: center;">
                  <p style="color: #ffffff; font-size: clamp(15px, 4vw, 17px); font-weight: 700; margin: 0 0 4px; letter-spacing: -0.01em;">${SCHOOL_NAME}</p>
                  <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 4px 0;">${SCHOOL_LOCATION}</p>
                  <p style="color: #94a3b8; font-size: clamp(12px, 3vw, 13px); margin: 4px 0 0;">Public Boarding School</p>
                  <div style="width: 40px; height: 2px; background: #475569; margin: 14px auto;"></div>
                  <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0 0 4px;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
                  <p style="color: #64748b; font-size: clamp(10px, 2.5vw, 11px); margin: 0;">📞 ${CONTACT_PHONE} | 📧 ${CONTACT_EMAIL}</p>
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
// SEND REGISTRATION EMAIL
// ====================================================================

async function sendRegistrationEmail(user) {
  try {
    const mailOptions = {
      from: {
        name: `${SCHOOL_NAME} - Staff Management`,
        address: process.env.EMAIL_USER
      },
      to: user.email,
      subject: `Administrator Account Created - ${SCHOOL_NAME}`,
      html: getRegistrationSuccessTemplate(user)
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Registration email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending registration email:', error);
  }
}

// Helpers
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set.');
    return false;
  }
  return true;
};

const validateInput = (name, email, password, role) => {
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  // If role is missing or invalid, default to ADMIN
  const validRoles = ['ADMIN', 'SUPER_ADMIN', 'USER'];
  if (!role || !validRoles.includes(role.toUpperCase())) {
    // No error, just default to ADMIN
  }
  return errors;
};

// Main POST
// Main POST
export async function POST(request) {
  try {
    let { name, email, password, phone, role } = await request.json();
    // Normalize role to Prisma enum (ADMIN or SUPER_ADMIN)
    let dbRole = (role || '').toUpperCase().replace(/[- ]/g, '_');
    if (!['ADMIN', 'SUPER_ADMIN'].includes(dbRole)) {
      dbRole = 'ADMIN';
    }

    // Only allow SUPER_ADMIN to create users (unless no users exist yet)
    const userCount = await prisma.user.count();
    let auth = null;
    if (userCount > 0) {
      auth = authenticateRequest(request);
      if (!auth.authenticated) {
        return auth.response;
      }
      const requesterRole = (auth.user.role || '').toUpperCase();
      if (requesterRole !== 'SUPER_ADMIN') {
        return NextResponse.json(
          {
            success: false,
            error: "Permission Denied",
            message: "Only SUPER_ADMIN users can create new admin accounts."
          },
          { status: 403 }
        );
      }

      if (dbRole === 'SUPER_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
        return NextResponse.json(
          {
            success: false,
            error: "Permission Denied",
            message: "Only SUPER_ADMIN can create another SUPER_ADMIN user."
          },
          { status: 403 }
        );
      }
    }

    // Prevent non-SUPERADMIN role assignment for first user
    if (userCount === 0 && dbRole !== 'SUPER_ADMIN') {
      dbRole = 'SUPER_ADMIN';
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (!validateEnvironment()) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const validationErrors = validateInput(name, email, password, role);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }

    // Check duplicates
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Save user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { 
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: dbRole
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true, 
        role: true, 
        image: true,
        emailVerified: true,
        createdAt: true, 
        updatedAt: true 
      },
    });

    // Send registration email
    await sendRegistrationEmail(user);

    // Generate token
    const token = generateToken(user);

    // Log successful creation
    console.log('✅ User created successfully:', {
      newUser: user.email,
      newUserRole: user.role,
      createdBy: auth?.user?.email || 'bootstrap',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Administrator account created successfully.',
        welcomeMessage: 'Welcome to the platform. Your administrator account has been registered successfully.',
        user: sanitizeUser(user),
        token
        // createdBy: only included if authentication is enabled
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error registering user:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



// GET users
export async function GET(request) {
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const requesterRole = (auth.user.role || '').toUpperCase();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(requesterRole)) {
      return NextResponse.json(
        { success: false, error: "Permission Denied" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        status: true,
        createdAt: true 
      },
    });
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
