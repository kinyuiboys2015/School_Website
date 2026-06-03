import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../libs/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'kinyui boys-student-secret-key-2024';
const STUDENT_TOKEN_EXPIRY = '2h';
const STUDENT_TOKEN_MAX_AGE = 2 * 60 * 60;
const SETUP_TOKEN_EXPIRY = '15m';
const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

const normalizeAdmissionNumber = (value) => String(value || '').trim().toUpperCase();
const normalizeUsername = (value) => String(value || '').trim().toLowerCase();

const normalizeName = (name) => String(name || '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, ' ')
  .replace(/[^a-z\s]/g, '')
  .split(' ')
  .filter(Boolean)
  .sort();

const getFullName = (student) => {
  const composed = [student?.firstName, student?.middleName, student?.lastName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return composed || student?.fullName || '';
};

const getAcademicLevel = (student) => student?.gradeLevel || student?.className || student?.form || '';
const getDisplayClass = (student) => {
  const level = getAcademicLevel(student);
  const stream = student?.stream;
  return [level, stream].filter(Boolean).join(' ') || 'Class not set';
};

const buildPortalAccountSnapshot = (student) => ({
  firstName: student.firstName || null,
  middleName: student.middleName || null,
  lastName: student.lastName || null,
  fullName: student.fullName || getFullName(student) || null,
  form: student.form || null,
  gradeLevel: student.gradeLevel || null,
  className: student.className || null,
  stream: student.stream || null,
  email: student.email || null,
  parentPhone: student.parentPhone || null,
  studentPhone: student.studentPhone || null,
  whatsappPhone: student.whatsappPhone || null,
});

const toSafeStudent = (student, account = null) => {
  const fullName = getFullName(student);
  const academicLevel = getAcademicLevel(student);

  return {
    id: student.id,
    admissionNumber: student.admissionNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    middleName: student.middleName,
    name: fullName,
    fullName,
    form: student.form,
    gradeLevel: student.gradeLevel,
    className: student.className,
    academicLevel,
    displayClass: getDisplayClass(student),
    stream: student.stream,
    email: student.email,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    parentPhone: student.parentPhone,
    studentPhone: student.studentPhone,
    whatsappPhone: student.whatsappPhone,
    address: student.address,
    portalUsername: account?.username || student.admissionNumber,
    hasPortalPassword: Boolean(account?.passwordHash)
  };
};

const findStudentByName = (student, nameParts) => {
  const dbNameParts = [
    student.firstName?.toLowerCase() || '',
    student.middleName?.toLowerCase() || '',
    student.lastName?.toLowerCase() || ''
  ].filter(Boolean);

  return nameParts.every(part => dbNameParts.some(dbName =>
    dbName === part ||
    dbName.startsWith(part) ||
    part.startsWith(dbName) ||
    (part.length === 1 && dbName[0] === part)
  ));
};

const findActiveStudentByAdmission = async (admissionNumber) => {
  const student = await prisma.databaseStudent.findUnique({
    where: { admissionNumber }
  });

  if (!student || student.status !== 'active') return null;
  return student;
};

const getOrCreatePortalAccount = async (student) => prisma.studentPortalAccount.upsert({
  where: { admissionNumber: student.admissionNumber },
  update: {
    ...buildPortalAccountSnapshot(student),
    status: 'active',
    updatedAt: new Date()
  },
  create: {
    admissionNumber: student.admissionNumber,
    username: student.admissionNumber.toLowerCase(),
    ...buildPortalAccountSnapshot(student),
    status: 'active'
  }
});

const generateStudentToken = (student, account) => jwt.sign(
  {
    accountId: account.id,
    studentId: student.id,
    admissionNumber: account.admissionNumber,
    name: getFullName(student),
    form: student.form,
    gradeLevel: student.gradeLevel,
    className: student.className,
    academicLevel: getAcademicLevel(student),
    stream: student.stream,
    role: 'student'
  },
  JWT_SECRET,
  { expiresIn: STUDENT_TOKEN_EXPIRY }
);

const generateSetupToken = (student, account) => jwt.sign(
  {
    type: 'student_password_setup',
    accountId: account.id,
    admissionNumber: account.admissionNumber,
    studentId: student.id,
    role: 'student'
  },
  JWT_SECRET,
  { expiresIn: SETUP_TOKEN_EXPIRY }
);

const createStudentSession = async (student, account, token, request) => {
  try {
    await prisma.studentSession.create({
      data: {
        studentId: student.id,
        admissionNumber: account.admissionNumber,
        name: getFullName(student),
        token,
        expiresAt: new Date(Date.now() + STUDENT_TOKEN_MAX_AGE * 1000),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });
  } catch (error) {
    console.warn('Student session tracking failed:', error.message);
  }
};

const tokenCookie = (token, maxAge = STUDENT_TOKEN_MAX_AGE) =>
  `student_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}; Secure=${process.env.NODE_ENV === 'production'}`;

const clearTokenCookie = () =>
  `student_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure=${process.env.NODE_ENV === 'production'}`;

const validateStrongPassword = (password) => {
  const value = String(password || '');
  const errors = [];

  if (value.length < 8) errors.push('Use at least 8 characters.');
  if (!/[a-z]/.test(value)) errors.push('Add a lowercase letter.');
  if (!/[A-Z]/.test(value)) errors.push('Add an uppercase letter.');
  if (!/\d/.test(value)) errors.push('Add a number.');

  return {
    valid: errors.length === 0,
    message: errors.length ? `Password is not strong enough. ${errors.join(' ')}` : ''
  };
};

const validateStudentByName = async (fullName, admissionNumber) => {
  const cleanAdmissionNumber = normalizeAdmissionNumber(admissionNumber);
  const cleanFullName = String(fullName || '').trim();
  const nameParts = normalizeName(cleanFullName);

  if (!cleanAdmissionNumber) {
    return { success: false, error: 'Please enter your admission number.', status: 400 };
  }

  if (nameParts.length < 1) {
    return { success: false, error: 'Please enter your registered name.', status: 400 };
  }

  const student = await prisma.databaseStudent.findUnique({
    where: { admissionNumber: cleanAdmissionNumber }
  });

  if (!student) {
    return {
      success: false,
      error: 'We could not find that admission number in the current student records. Please confirm it or contact the school office.',
      requiresContact: true,
      status: 404
    };
  }

  if (student.status !== 'active') {
    return {
      success: false,
      error: 'This student record is not active right now. Please contact the school office for help.',
      requiresContact: true,
      status: 403
    };
  }

  if (!findStudentByName(student, nameParts)) {
    return {
      success: false,
      error: 'The name does not match this admission number. Check the spelling or use the name in the school record.',
      requiresContact: true,
      status: 401
    };
  }

  return { success: true, student };
};

const findPortalAccountByIdentifier = async (identifier) => {
  const raw = String(identifier || '').trim();
  if (!raw) return null;

  return prisma.studentPortalAccount.findFirst({
    where: {
      OR: [
        { admissionNumber: normalizeAdmissionNumber(raw) },
        { username: normalizeUsername(raw) }
      ]
    }
  });
};

const passwordLogin = async (body, request) => {
  const identifier = body.identifier || body.username || body.admissionNumber;
  const password = String(body.password || '');

  if (!identifier || !password) {
    return NextResponse.json(
      { success: false, error: 'Enter your admission number or username and password.' },
      { status: 400 }
    );
  }

  const account = await findPortalAccountByIdentifier(identifier);
  if (!account || account.status !== 'active') {
    return NextResponse.json(
      {
        success: false,
        error: 'No portal password has been created for those details. Use first-time access to verify your admission number.'
      },
      { status: 404 }
    );
  }

  if (!account.passwordHash) {
    return NextResponse.json(
      {
        success: false,
        requiresPasswordSetup: true,
        error: 'This account is verified but does not have a password yet. Please use first-time access to create one.'
      },
      { status: 403 }
    );
  }

  if (account.lockedUntil && account.lockedUntil > new Date()) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many wrong password attempts. Try again after ${account.lockedUntil.toLocaleTimeString()}.`
      },
      { status: 429 }
    );
  }

  const passwordMatches = await bcrypt.compare(password, account.passwordHash);
  if (!passwordMatches) {
    const failedLoginCount = (account.failedLoginCount || 0) + 1;
    const lockedUntil = failedLoginCount >= MAX_FAILED_LOGINS
      ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
      : null;

    await prisma.studentPortalAccount.update({
      where: { id: account.id },
      data: { failedLoginCount, lockedUntil }
    });

    return NextResponse.json(
      {
        success: false,
        error: lockedUntil
          ? `Password is incorrect. The account is locked for ${LOCK_MINUTES} minutes.`
          : `Password is incorrect. ${MAX_FAILED_LOGINS - failedLoginCount} attempt(s) remaining before a temporary lock.`
      },
      { status: 401 }
    );
  }

  const student = await findActiveStudentByAdmission(account.admissionNumber);
  if (!student) {
    return NextResponse.json(
      {
        success: false,
        requiresContact: true,
        error: 'Your portal password is saved, but your active student record is missing. Ask the school office to refresh your student record.'
      },
      { status: 404 }
    );
  }

  const updatedAccount = await prisma.studentPortalAccount.update({
    where: { id: account.id },
    data: {
      ...buildPortalAccountSnapshot(student),
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date()
    }
  });

  const token = generateStudentToken(student, updatedAccount);
  await createStudentSession(student, updatedAccount, token, request);

  return NextResponse.json({
    success: true,
    message: 'Login successful.',
    student: toSafeStudent(student, updatedAccount),
    token,
    expiresIn: '2 hours',
    permissions: {
      canViewResources: true,
      canViewAssignments: true,
      canDownloadMaterials: true
    }
  }, {
    status: 200,
    headers: { 'Set-Cookie': tokenCookie(token) }
  });
};

const verifyFirstAccess = async (body) => {
  const validation = await validateStudentByName(body.fullName, body.admissionNumber);
  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: validation.error,
        requiresContact: validation.requiresContact || false
      },
      { status: validation.status || 401 }
    );
  }

  const student = validation.student;
  const account = await getOrCreatePortalAccount(student);

  if (account.passwordHash) {
    return NextResponse.json(
      {
        success: false,
        requiresPassword: true,
        error: 'A portal password already exists for this admission number. Please sign in with your password.'
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    success: true,
    requiresPasswordSetup: true,
    message: 'Student verified. Create a strong password to finish setting up your portal access.',
    setupToken: generateSetupToken(student, account),
    student: toSafeStudent(student, account)
  });
};

const setupPassword = async (body, request) => {
  const password = String(body.password || '');
  const confirmPassword = String(body.confirmPassword || body.passwordConfirmation || '');

  if (!body.setupToken) {
    return NextResponse.json(
      { success: false, error: 'Password setup session is missing. Please verify your admission number again.' },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { success: false, error: 'The two passwords do not match.' },
      { status: 400 }
    );
  }

  const strength = validateStrongPassword(password);
  if (!strength.valid) {
    return NextResponse.json(
      { success: false, error: strength.message },
      { status: 400 }
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(body.setupToken, JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Password setup expired. Please verify your details again.' },
      { status: 401 }
    );
  }

  if (decoded.type !== 'student_password_setup' || decoded.role !== 'student') {
    return NextResponse.json(
      { success: false, error: 'Invalid password setup session. Please start again.' },
      { status: 401 }
    );
  }

  const admissionNumber = normalizeAdmissionNumber(decoded.admissionNumber);
  const student = await findActiveStudentByAdmission(admissionNumber);
  if (!student) {
    return NextResponse.json(
      { success: false, requiresContact: true, error: 'Your student record is not active. Please contact the school office.' },
      { status: 404 }
    );
  }

  const username = body.username ? normalizeUsername(body.username) : admissionNumber.toLowerCase();
  if (username && (username.length < 3 || username.length > 50)) {
    return NextResponse.json(
      { success: false, error: 'Username must be between 3 and 50 characters.' },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  let account;
  try {
    account = await prisma.studentPortalAccount.upsert({
      where: { admissionNumber },
      update: {
        ...buildPortalAccountSnapshot(student),
        username,
        passwordHash,
        passwordSetAt: new Date(),
        passwordCreatedAt: new Date(),
        failedLoginCount: 0,
        lockedUntil: null,
        status: 'active'
      },
      create: {
        admissionNumber,
        username,
        passwordHash,
        ...buildPortalAccountSnapshot(student),
        passwordSetAt: new Date(),
        passwordCreatedAt: new Date(),
        status: 'active'
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'That username is already in use. Please choose another one.' },
        { status: 409 }
      );
    }
    throw error;
  }

  const token = generateStudentToken(student, account);
  await createStudentSession(student, account, token, request);

  return NextResponse.json({
    success: true,
    message: 'Password created successfully. You are now signed in.',
    student: toSafeStudent(student, account),
    token,
    expiresIn: '2 hours'
  }, {
    status: 200,
    headers: { 'Set-Cookie': tokenCookie(token) }
  });
};

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body.action ||
      (body.setupToken ? 'set-password' : body.password ? 'login' : 'verify-first-access');

    if (action === 'login') {
      return await passwordLogin(body, request);
    }

    if (action === 'set-password') {
      return await setupPassword(body, request);
    }

    return await verifyFirstAccess(body);
  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'We could not complete that request. Please try again in a moment.'
      },
      { status: 500 }
    );
  }
}

const getTokenFromRequest = (request) => {
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    if (cookies.student_token) return cookies.student_token;
  }

  return request.headers.get('authorization')?.replace('Bearer ', '') || null;
};

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Please sign in to access the student portal.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'student') {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'This session is not a student portal session.' },
        { status: 401 }
      );
    }

    const account = decoded.accountId
      ? await prisma.studentPortalAccount.findUnique({ where: { id: decoded.accountId } })
      : await prisma.studentPortalAccount.findUnique({ where: { admissionNumber: normalizeAdmissionNumber(decoded.admissionNumber) } });

    if (!account || account.status !== 'active') {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Portal account not found. Please verify your admission number again.' },
        { status: 401 }
      );
    }

    const student = await findActiveStudentByAdmission(account.admissionNumber);
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          requiresContact: true,
          error: 'Your portal account is saved, but your current student record is missing. Please contact the school office.'
        },
        { status: 404 }
      );
    }

    try {
      const session = await prisma.studentSession.findFirst({
        where: {
          token,
          expiresAt: { gt: new Date() }
        }
      });

      if (!session) {
        console.warn('Student session row not found; JWT is still valid.');
      }
    } catch (sessionError) {
      console.warn('Student session check failed:', sessionError.message);
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      student: toSafeStudent(student, account),
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Your session has expired. Please sign in again.',
          requiresReauth: true
        },
        { status: 401 }
      );
    }

    console.error('Student token verification error:', error);
    return NextResponse.json(
      { success: false, authenticated: false, error: 'Your session could not be verified. Please sign in again.' },
      { status: 401 }
    );
  }
}

export async function DELETE(request) {
  try {
    const token = getTokenFromRequest(request);

    if (token) {
      try {
        await prisma.studentSession.deleteMany({ where: { token } });
      } catch (error) {
        console.warn('Error deleting student session:', error.message);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Logged out successfully.' },
      { headers: { 'Set-Cookie': clearTokenCookie() } }
    );
  } catch (error) {
    console.error('Student logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed. Please try again.' },
      { status: 500 }
    );
  }
}
