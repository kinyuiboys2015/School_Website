import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from '../../../libs/prisma';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;
const CREATE_CHUNK_SIZE = 250;
const UPDATE_CHUNK_SIZE = 25;

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
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
        
        // Check user role - only admins/staff can manage students
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER', 'TEACHER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage students' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Student management authentication successful for user:', adminPayload.name || 'Unknown');
      
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

// Authentication middleware for protected requests
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
          message: "Authentication required to manage student data.",
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

// ========== HELPER FUNCTIONS ==========

// Helper to parse dates consistently
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  const str = String(dateStr).trim();
  
  // Reject extended year formats
  if (str.match(/^[+-]\d{6}/)) return null;
  
  // Try Excel serial number
  if (!isNaN(str) && Number(str) > 0) {
    const excelDate = Number(str);
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      if (year >= 1900 && year <= new Date().getFullYear() + 5) {
        return date;
      }
    }
  }
  
  // Try ISO string
  let date = new Date(str);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    if (year >= 1900 && year <= new Date().getFullYear() + 5) {
      return date;
    }
  }
  
  // Try common formats
  const formats = [
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
  ];
  
  for (const format of formats) {
    const match = str.match(format);
    if (match) {
      let year, month, day;
      
      if (match[1].length === 4) {
        // YYYY-MM-DD or YYYY/MM/DD
        year = parseInt(match[1]);
        month = parseInt(match[2]) - 1;
        day = parseInt(match[3]);
      } else {
        // DD/MM/YYYY or MM/DD/YYYY
        const part1 = parseInt(match[1]);
        const part2 = parseInt(match[2]);
        const part3 = parseInt(match[3]);
        
        if (part3 > 31) {
          // DD/MM/YYYY or MM/DD/YYYY with 4-digit year
          if (part1 > 12) {
            // DD/MM/YYYY
            day = part1;
            month = part2 - 1;
            year = part3;
          } else {
            // MM/DD/YYYY
            month = part1 - 1;
            day = part2;
            year = part3;
          }
        } else {
          // Ambiguous, assume DD/MM/YYYY
          day = part1;
          month = part2 - 1;
          year = part3 < 100 ? 2000 + part3 : part3;
        }
      }
      
      if (year && month >= 0 && day) {
        date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          const finalYear = date.getFullYear();
          if (finalYear >= 1900 && finalYear <= new Date().getFullYear() + 5) {
            return date;
          }
        }
      }
    }
  }
  
  return null;
};

const chunkArray = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const normalizeAdmissionNumber = (value) => String(value || '')
  .trim()
  .toUpperCase()
  .replace(/\s+/g, '');

const normalizeForm = (value) => {
  const formValue = String(value || '').trim().toLowerCase();
  const formMap = {
    form1: 'Form 1',
    'form 1': 'Form 1',
    one: 'Form 1',
    'grade 9': 'Form 1',
    'class 9': 'Form 1',
    '1': 'Form 1',
    form2: 'Form 2',
    'form 2': 'Form 2',
    two: 'Form 2',
    'grade 10': 'Form 2',
    'class 10': 'Form 2',
    '2': 'Form 2',
    form3: 'Form 3',
    'form 3': 'Form 3',
    three: 'Form 3',
    'grade 11': 'Form 3',
    'class 11': 'Form 3',
    '3': 'Form 3',
    form4: 'Form 4',
    'form 4': 'Form 4',
    four: 'Form 4',
    'grade 12': 'Form 4',
    'class 12': 'Form 4',
    '4': 'Form 4'
  };

  return formMap[formValue] || String(value || '').trim();
};

const normalizeGender = (value) => {
  const gender = String(value || '').trim().toLowerCase();
  if (!gender) return null;
  if (['m', 'male', 'boy'].includes(gender)) return 'Male';
  if (['f', 'female', 'girl'].includes(gender)) return 'Female';
  return String(value).trim();
};

const normalizeColumnHeader = (header) => {
  const key = String(header || '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

  if (['admissionnumber', 'admissionno', 'admno', 'admnumber', 'adm', 'studentnumber', 'studentid'].includes(key)) return 'admissionNumber';
  if (['firstname', 'first', 'fname', 'givenname'].includes(key)) return 'firstName';
  if (['middlename', 'middle', 'mname', 'othernames', 'secondname'].includes(key)) return 'middleName';
  if (['lastname', 'last', 'surname', 'familyname'].includes(key)) return 'lastName';
  if (['form', 'class', 'grade', 'level'].includes(key)) return 'form';
  if (['stream', 'classstream'].includes(key)) return 'stream';
  if (['dateofbirth', 'dob', 'birthdate', 'birthdateyear'].includes(key)) return 'dateOfBirth';
  if (['gender', 'sex'].includes(key)) return 'gender';
  if (['parentphone', 'guardianphone', 'phone', 'phonenumber', 'parenttel', 'telephone'].includes(key)) return 'parentPhone';
  if (['email', 'emailaddress', 'parentemail', 'guardianemail'].includes(key)) return 'email';
  if (['address', 'homeaddress', 'residence', 'location'].includes(key)) return 'address';
  if (['status', 'studentstatus'].includes(key)) return 'status';

  return key;
};

const normalizeRowKeys = (row) => Object.entries(row || {}).reduce((acc, [key, value]) => {
  const normalizedKey = normalizeColumnHeader(key);
  if (normalizedKey && (acc[normalizedKey] === undefined || acc[normalizedKey] === '')) {
    acc[normalizedKey] = value;
  }
  return acc;
}, {});

const isEmptyRow = (row) => Object.values(row || {}).every(value => String(value ?? '').trim() === '');

const parseStudentRow = (row, index) => {
  const normalized = normalizeRowKeys(row);
  if (isEmptyRow(normalized)) return null;

  const rawDateOfBirth = normalized.dateOfBirth;
  const hasDateValue = String(rawDateOfBirth ?? '').trim() !== '';
  const parsedDate = hasDateValue ? parseDate(rawDateOfBirth) : null;

  return {
    rowNumber: index + 2,
    admissionNumber: normalizeAdmissionNumber(normalized.admissionNumber),
    firstName: String(normalized.firstName || '').trim(),
    middleName: String(normalized.middleName || '').trim() || null,
    lastName: String(normalized.lastName || '').trim(),
    form: normalizeForm(normalized.form),
    stream: String(normalized.stream || '').trim() || null,
    dateOfBirth: parsedDate,
    dateOfBirthRaw: hasDateValue ? String(rawDateOfBirth).trim() : null,
    dateOfBirthInvalid: hasDateValue && !parsedDate,
    gender: normalizeGender(normalized.gender),
    parentPhone: String(normalized.parentPhone || '').trim() || null,
    email: String(normalized.email || '').trim().toLowerCase() || null,
    address: String(normalized.address || '').trim() || null,
    status: String(normalized.status || 'active').trim().toLowerCase()
  };
};

const toStudentCreateData = (student, uploadBatchId, formOverride = null) => ({
  admissionNumber: student.admissionNumber,
  firstName: student.firstName,
  middleName: student.middleName || null,
  lastName: student.lastName,
  form: formOverride || student.form,
  stream: student.stream || null,
  dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
  gender: student.gender || null,
  parentPhone: student.parentPhone || null,
  email: student.email || null,
  address: student.address || null,
  uploadBatchId,
  status: 'active'
});

const friendlyUploadError = (error) => {
  const message = error?.message || '';
  if (message.includes('P2002') || error?.code === 'P2002') {
    return 'One or more admission numbers already exist. Check duplicate feedback and choose skip or replace.';
  }
  if (message.toLowerCase().includes('timeout')) {
    return 'The upload took too long to finish. Try again with the same file; the server will skip duplicates safely.';
  }
  if (message.toLowerCase().includes('max_allowed_packet')) {
    return 'The upload is too large for the database request. Split the file by form and try again.';
  }
  return message || 'Upload failed. Please check the file and try again.';
};

// Build WHERE clause from query parameters
const buildWhereClause = (params) => {
  const { form, stream, gender, status, search } = params;
  const where = {};
  
  if (form && form !== 'all') where.form = form;
  if (stream && stream !== 'all') where.stream = stream;
  if (gender && gender !== 'all') where.gender = gender;
  if (status && status !== 'all') where.status = status;
  
  if (search && search.trim()) {
    const searchTerm = search.toLowerCase();
    
    where.OR = [
      { admissionNumber: { contains: searchTerm } },
      { firstName: { contains: searchTerm } },
      { middleName: { contains: searchTerm } },
      { lastName: { contains: searchTerm } },
      { email: { contains: searchTerm } },
      { parentPhone: { contains: searchTerm } }
    ];
  }
  
  return where;
};

// Calculate statistics from WHERE clause
const calculateStatistics = async (whereClause = {}) => {
  try {
    // Get form distribution
    const formStats = await prisma.databaseStudent.groupBy({
      by: ['form'],
      where: whereClause,
      _count: { id: true }
    });

    // Get total count
    const totalStudents = await prisma.databaseStudent.count({
      where: whereClause
    });

    // Convert to structured format
    const formStatsObj = formStats.reduce((acc, stat) => ({
      ...acc,
      [stat.form]: stat._count.id
    }), {});

    const stats = {
      totalStudents,
      form1: formStatsObj['Form 1'] || 0,
      form2: formStatsObj['Form 2'] || 0,
      form3: formStatsObj['Form 3'] || 0,
      form4: formStatsObj['Form 4'] || 0,
      updatedAt: new Date()
    };

    // Validate consistency
    const formSum = stats.form1 + stats.form2 + stats.form3 + stats.form4;
    const isValid = formSum === totalStudents;

    return {
      stats,
      validation: {
        isValid,
        totalStudents,
        sumOfForms: formSum,
        difference: totalStudents - formSum,
        hasDiscrepancy: !isValid
      }
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    throw error;
  }
};

// Update cached statistics
const updateCachedStats = async (stats) => {
  try {
    await prisma.studentStats.upsert({
      where: { id: 'global_stats' },
      update: {
        totalStudents: stats.totalStudents,
        form1: stats.form1,
        form2: stats.form2,
        form3: stats.form3,
        form4: stats.form4,
        updatedAt: new Date()
      },
      create: {
        id: 'global_stats',
        ...stats
      }
    });
  } catch (error) {
    console.error('Error updating cached stats:', error);
  }
};

const refreshGlobalStudentStats = async () => {
  const statsResult = await calculateStatistics({ status: 'active' });
  await updateCachedStats(statsResult.stats);
  return statsResult;
};

// ========== UPLOAD STRATEGY FUNCTIONS ==========

// Validate and normalize form selection
const validateFormSelection = (forms) => {
  if (!forms || forms.length === 0) {
    throw new Error('Please select at least one form to upload');
  }
  
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const normalizedForms = [];
  
  forms.forEach(form => {
    const normalized = normalizeForm(form);
    if (validForms.includes(normalized)) {
      normalizedForms.push(normalized);
    }
  });
  
  if (normalizedForms.length === 0) {
    throw new Error('Please select valid forms (Form 1, Form 2, Form 3, Form 4)');
  }
  
  return normalizedForms;
};

// Check for duplicate admission numbers
const checkDuplicateAdmissionNumbers = async (students, targetForm = null) => {
  const admissionNumbers = students.map(s => s.admissionNumber);
  
  const whereClause = {
    admissionNumber: { in: admissionNumbers }
  };
  
  if (targetForm) {
    whereClause.form = targetForm;
  }
  
  const existingStudents = await prisma.databaseStudent.findMany({
    where: whereClause,
    select: {
      admissionNumber: true,
      firstName: true,
      lastName: true,
      form: true
    }
  });
  
  const duplicates = students
    .map((student, index) => {
      const existing = existingStudents.find(s => s.admissionNumber === student.admissionNumber);
      if (existing) {
        return {
          row: index + 2,
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          form: student.form,
          existingName: `${existing.firstName} ${existing.lastName}`,
          existingForm: existing.form
        };
      }
      return null;
    })
    .filter(dup => dup !== null);
  
  return duplicates;
};

// Process New Upload
const processNewUpload = async (students, uploadBatchId, selectedForms, duplicateAction = 'skip') => {
  const stats = {
    totalRows: students.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    createdRows: 0,
    updatedRows: 0,
    errors: [],
    createdStudents: []
  };

  const filteredStudents = students.filter(student => selectedForms.includes(student.form));
  if (filteredStudents.length === 0) {
    throw new Error(`No students in the file match the selected forms: ${selectedForms.join(', ')}.`);
  }

  const seenAdmissionNumbers = new Set();
  const validStudents = [];
  const admissionNumbersPresentInFile = new Set(
    filteredStudents
      .map(student => student.admissionNumber)
      .filter(Boolean)
  );

  for (const [index, student] of filteredStudents.entries()) {
    const validation = validateStudent(student, index);
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }

    if (seenAdmissionNumbers.has(student.admissionNumber)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${student.rowNumber || index + 2}: Duplicate admission number in this file: ${student.admissionNumber}.`);
      continue;
    }

    seenAdmissionNumbers.add(student.admissionNumber);
    validStudents.push(student);
  }

  if (validStudents.length === 0) return stats;

  const existingStudents = await prisma.databaseStudent.findMany({
    where: { admissionNumber: { in: validStudents.map(s => s.admissionNumber) } },
    select: { id: true, admissionNumber: true, form: true }
  });
  const existingMap = new Map(existingStudents.map(student => [student.admissionNumber, student]));

  const studentsToCreate = [];
  const studentsToUpdate = [];

  for (const student of validStudents) {
    const existing = existingMap.get(student.admissionNumber);

    if (existing) {
      if (duplicateAction === 'replace' && existing.form === student.form) {
        studentsToUpdate.push({ id: existing.id, student });
      } else {
        stats.skippedRows++;
        stats.errors.push(
          existing.form === student.form
            ? `Row ${student.rowNumber}: Admission number ${student.admissionNumber} already exists and was skipped.`
            : `Row ${student.rowNumber}: Admission number ${student.admissionNumber} already exists in ${existing.form}. It was not moved automatically.`
        );
      }
      continue;
    }

    studentsToCreate.push(toStudentCreateData(student, uploadBatchId));
  }

  for (const chunk of chunkArray(studentsToCreate, CREATE_CHUNK_SIZE)) {
    await prisma.databaseStudent.createMany({
      data: chunk,
      skipDuplicates: true
    });
    stats.createdRows += chunk.length;
  }

  for (const chunk of chunkArray(studentsToUpdate, UPDATE_CHUNK_SIZE)) {
    await Promise.all(chunk.map(({ id, student }) => prisma.databaseStudent.update({
      where: { id },
      data: {
        ...toStudentCreateData(student, uploadBatchId),
        updatedAt: new Date()
      }
    })));
    stats.updatedRows += chunk.length;
  }

  stats.validRows = stats.createdRows + stats.updatedRows;
  stats.createdStudents = studentsToCreate;
  return stats;
};

// Process Update Upload
const processUpdateUpload = async (students, uploadBatchId, targetForm) => {
  const stats = {
    totalRows: students.length,
    validRows: 0,
    updatedRows: 0,
    createdRows: 0,
    deactivatedRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    updatedStudents: [],
    createdStudents: []
  };

  const filteredStudents = students.filter(student => student.form === targetForm);
  if (filteredStudents.length === 0) {
    throw new Error(`No rows in the file are marked as ${targetForm}. Check the form column or choose the correct target form.`);
  }

  const seenAdmissionNumbers = new Set();
  const validStudents = [];

  for (const [index, student] of filteredStudents.entries()) {
    const validation = validateStudent(student, index);
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }

    if (seenAdmissionNumbers.has(student.admissionNumber)) {
      stats.errorRows++;
      stats.errors.push(`Row ${student.rowNumber || index + 2}: Duplicate admission number in this file: ${student.admissionNumber}.`);
      continue;
    }

    seenAdmissionNumbers.add(student.admissionNumber);
    validStudents.push(student);
  }

  if (validStudents.length === 0) return stats;

  const admissionNumbers = validStudents.map(student => student.admissionNumber);
  const [existingInTargetForm, existingAcrossForms] = await Promise.all([
    prisma.databaseStudent.findMany({
      where: { form: targetForm, status: 'active' },
      select: { id: true, admissionNumber: true }
    }),
    prisma.databaseStudent.findMany({
      where: { admissionNumber: { in: admissionNumbers } },
      select: { id: true, admissionNumber: true, form: true }
    })
  ]);

  const targetMap = new Map(existingInTargetForm.map(student => [student.admissionNumber, student]));
  const anyFormMap = new Map(existingAcrossForms.map(student => [student.admissionNumber, student]));
  const studentsToCreate = [];
  const studentsToUpdate = [];

  for (const student of validStudents) {
    const existingTargetStudent = targetMap.get(student.admissionNumber);

    if (existingTargetStudent) {
      studentsToUpdate.push({ id: existingTargetStudent.id, student });
      continue;
    }

    const existingOtherForm = anyFormMap.get(student.admissionNumber);
    if (existingOtherForm && existingOtherForm.form !== targetForm) {
      stats.skippedRows++;
      stats.errors.push(`Row ${student.rowNumber}: Admission number ${student.admissionNumber} already belongs to ${existingOtherForm.form}, so it was not added to ${targetForm}.`);
      continue;
    }

    studentsToCreate.push(toStudentCreateData(student, uploadBatchId, targetForm));
  }

  for (const chunk of chunkArray(studentsToUpdate, UPDATE_CHUNK_SIZE)) {
    await Promise.all(chunk.map(({ id, student }) => prisma.databaseStudent.update({
      where: { id },
      data: {
        firstName: student.firstName,
        middleName: student.middleName || null,
        lastName: student.lastName,
        stream: student.stream || null,
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
        gender: student.gender || null,
        parentPhone: student.parentPhone || null,
        email: student.email || null,
        address: student.address || null,
        uploadBatchId,
        status: 'active',
        updatedAt: new Date()
      }
    })));
    stats.updatedRows += chunk.length;
  }

  for (const chunk of chunkArray(studentsToCreate, CREATE_CHUNK_SIZE)) {
    await prisma.databaseStudent.createMany({
      data: chunk,
      skipDuplicates: true
    });
    stats.createdRows += chunk.length;
  }

  const studentsToDeactivate = existingInTargetForm.filter(student => !admissionNumbersPresentInFile.has(student.admissionNumber));
  for (const chunk of chunkArray(studentsToDeactivate, CREATE_CHUNK_SIZE)) {
    const result = await prisma.databaseStudent.updateMany({
      where: { id: { in: chunk.map(student => student.id) } },
      data: {
        status: 'inactive',
        updatedAt: new Date()
      }
    });
    stats.deactivatedRows += result.count;
  }

  stats.validRows = stats.updatedRows + stats.createdRows;
  stats.createdStudents = studentsToCreate;
  return stats;
};

// ========== CSV PARSING ==========
const parseCSV = async (file) => {
  const text = await file.text();
  if (!text.trim()) {
    throw new Error('The CSV file is empty. Please upload a file with student rows.');
  }

  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: normalizeColumnHeader,
      delimitersToGuess: [',', '\t', ';', '|'],
      complete: (results) => {
        const headers = results.meta.fields || [];
        const requiredColumns = ['admissionNumber', 'firstName', 'lastName', 'form'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          reject(new Error(`Missing required column(s): ${missingColumns.join(', ')}. Use columns like admissionNumber, firstName, lastName, and form.`));
          return;
        }

        const data = results.data
          .map((row, index) => parseStudentRow(row, index))
          .filter(Boolean);

        if (data.length === 0) {
          reject(new Error('No student rows were found in the CSV file. Check that the data starts directly under the header row.'));
          return;
        }

        if (results.errors?.length) {
          console.warn('CSV parser warnings:', results.errors.slice(0, 5));
        }

        resolve(data);
      },
      error: (error) => reject(new Error(`CSV parsing failed: ${error.message}`))
    });
  });
};

// ========== EXCEL PARSING ==========
const parseExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

    const sheetName = workbook.SheetNames.find(name => workbook.Sheets[name]?.['!ref']);
    if (!sheetName) {
      throw new Error('The Excel workbook does not contain a readable sheet.');
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: false,
      dateNF: 'yyyy-mm-dd'
    });

    if (jsonData.length === 0) {
      throw new Error('The Excel sheet is empty. Please add student rows below the header row.');
    }

    const normalizedHeaders = Object.keys(jsonData[0] || {}).map(normalizeColumnHeader);
    const requiredColumns = ['admissionNumber', 'firstName', 'lastName', 'form'];
    const missingColumns = requiredColumns.filter(col => !normalizedHeaders.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required column(s): ${missingColumns.join(', ')}. Use columns like admissionNumber, firstName, lastName, and form.`);
    }

    const data = jsonData
      .map((row, index) => parseStudentRow(row, index))
      .filter(Boolean);

    if (data.length === 0) {
      throw new Error('No student rows were found in the Excel file. Check that the first sheet has student data.');
    }

    return data;
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== VALIDATION ==========
const validateStudent = (student, index) => {
  const errors = [];
  const row = student.rowNumber || index + 2;
  
  // Admission number
  if (!student.admissionNumber) {
    errors.push(`Row ${row}: Admission number is required.`);
  } else if (!/^[A-Z0-9/-]{2,20}$/.test(student.admissionNumber)) {
    errors.push(`Row ${row}: Admission number should be 2-20 letters or numbers. Found "${student.admissionNumber}".`);
  }
  
  // Names
  if (!student.firstName) {
    errors.push(`Row ${row}: First name is required.`);
  } else if (student.firstName.length > 100) {
    errors.push(`Row ${row}: First name is too long. Use 100 characters or fewer.`);
  }
  
  if (!student.lastName) {
    errors.push(`Row ${row}: Last name is required.`);
  } else if (student.lastName.length > 100) {
    errors.push(`Row ${row}: Last name is too long. Use 100 characters or fewer.`);
  }
  
  // Form validation
  const formValue = String(student.form || '').trim();
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  
  if (!validForms.includes(formValue)) {
    errors.push(`Row ${row}: Form must be one of ${validForms.join(', ')}. Found "${formValue || 'blank'}".`);
  }
  
  // Update student with normalized form
  student.form = formValue;
  
  // Date of birth
  if (student.dateOfBirthInvalid) {
    errors.push(`Row ${row}: Date of birth "${student.dateOfBirthRaw}" is not a valid date. Use YYYY-MM-DD or DD/MM/YYYY.`);
  }

  if (student.dateOfBirth) {
    const dob = new Date(student.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.push(`Row ${row}: Invalid date of birth format.`);
    } else {
      const year = dob.getFullYear();
      const currentYear = new Date().getFullYear();
      
      if (dob > new Date()) {
        errors.push(`Row ${row}: Date of birth cannot be in the future.`);
      }
      
      if (year < 1900) {
        errors.push(`Row ${row}: Date of birth year must be after 1900.`);
      }
      
      const age = currentYear - year;
      if (age < 4) {
        errors.push(`Row ${row}: Student appears to be too young (${age} years old).`);
      }
      
      if (age > 30) {
        errors.push(`Row ${row}: Student appears to be too old (${age} years old).`);
      }
    }
  }
  
  // Optional fields
  if (student.middleName && student.middleName.length > 100) {
    errors.push(`Row ${row}: Middle name is too long. Use 100 characters or fewer.`);
  }
  
  if (student.stream && student.stream.length > 50) {
    errors.push(`Row ${row}: Stream is too long. Use 50 characters or fewer.`);
  }
  
  if (student.gender && student.gender.length > 20) {
    errors.push(`Row ${row}: Gender is too long. Use 20 characters or fewer.`);
  }
  
  if (student.parentPhone) {
    const phoneRegex = /^[+]?[0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(student.parentPhone)) {
      errors.push(`Row ${row}: Parent phone number is invalid.`);
    } else if (student.parentPhone.length > 20) {
      errors.push(`Row ${row}: Parent phone is too long. Use 20 characters or fewer.`);
    }
  }
  
  if (student.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      errors.push(`Row ${row}: Email address is invalid.`);
    } else if (student.email.length > 100) {
      errors.push(`Row ${row}: Email is too long. Use 100 characters or fewer.`);
    }
  }
  
  if (student.address && student.address.length > 255) {
    errors.push(`Row ${row}: Address is too long. Use 255 characters or fewer.`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// ========== API ENDPOINTS ==========

// GET - Main endpoint with consistent statistics (PUBLIC - no authentication required)
export async function GET(request) {
  try {
    // ✅ AUTHENTICATION CHECK - Protect sensitive student data
    const auth = authenticateRequest(request);
    
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📖 Student data request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const form = url.searchParams.get('form') || '';
    const stream = url.searchParams.get('stream') || '';
    const gender = url.searchParams.get('gender') || '';
    const status = url.searchParams.get('status') || 'active';
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const includeStats = url.searchParams.get('includeStats') !== 'false';

    // Build filters
    const filters = { form, stream, gender, status, search };
    const where = buildWhereClause(filters);

if (action === 'uploads') {
  const rawUploads = await prisma.studentBulkUpload.findMany({
    orderBy: { uploadDate: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      fileName: true,
      fileType: true,
      status: true,
      uploadDate: true,
      uploadedBy: true,
      processedDate: true,
      totalRows: true,
      validRows: true,
      skippedRows: true,
      errorRows: true,
      errorLog: true
    }
  });

  const total = await prisma.studentBulkUpload.count();
  const uploads = rawUploads.map((upload) => ({
    ...upload,
    status: ['completed', 'success', 'successful'].includes(String(upload.status || '').toLowerCase())
      ? 'completed'
      : 'failed'
  }));
  
  return NextResponse.json({
    success: true,
    uploads,
    pagination: { 
      page, 
      limit, 
      total, 
      pages: Math.ceil(total / limit) 
    }
  });
}
    if (action === 'stats') {
      // Calculate fresh statistics with filters
      const statsResult = await calculateStatistics(where);
      
      // Update cache for consistency
      if (Object.keys(where).length === 0) {
        await updateCachedStats(statsResult.stats);
      }
      
      return NextResponse.json({
        success: true,
        data: {
          stats: statsResult.stats,
          filters,
          validation: statsResult.validation,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Get students with pagination
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [students, total] = await Promise.all([
      prisma.databaseStudent.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          admissionNumber: true,
          firstName: true,
          middleName: true,
          lastName: true,
          form: true,
          stream: true,
          dateOfBirth: true,
          gender: true,
          parentPhone: true,
          email: true,
          address: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          uploadBatchId: true,
          uploadBatch: {
            select: {
              fileName: true,
              uploadDate: true
            }
          }
        }
      }),
      prisma.databaseStudent.count({ where })
    ]);

    // Calculate statistics for this filtered set
    let statsResult = null;
    if (includeStats) {
      statsResult = await calculateStatistics(where);
      
      // If no filters, update cache
      if (Object.keys(where).length === 0) {
        await updateCachedStats(statsResult.stats);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        students,
        stats: statsResult?.stats || null,
        filters,
        validation: statsResult?.validation || null,
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST - Bulk upload with new strategy (with authentication)
export async function POST(request) {
  let batchId = null;
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📝 Student bulk upload request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType');
    const formsInput = formData.get('forms');
    const targetForm = formData.get('targetForm');
    const checkDuplicates = formData.get('checkDuplicates') === 'true';
    const duplicateAction = formData.get('duplicateAction') || 'skip';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'Please choose a CSV or Excel file before uploading.', authenticated: true },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'The selected file is empty. Please upload a file with student records.', authenticated: true },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { success: false, error: 'The file is too large. Please keep student uploads below 15 MB or split the file by form.', authenticated: true },
        { status: 413 }
      );
    }

    if (!uploadType) {
      return NextResponse.json(
        { success: false, error: 'Choose whether this is a new upload or a form update.', authenticated: true },
        { status: 400 }
      );
    }

    let selectedForms = [];
    if (uploadType === 'new') {
      if (!formsInput) {
        return NextResponse.json(
          { success: false, error: 'Select at least one form for a new upload.', authenticated: true },
          { status: 400 }
        );
      }
      try {
        const forms = JSON.parse(formsInput);
        selectedForms = validateFormSelection(forms);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: error.message || 'Invalid form selection.', authenticated: true },
          { status: 400 }
        );
      }
    } else if (uploadType === 'update') {
      if (!targetForm) {
        return NextResponse.json(
          { success: false, error: 'Choose the form you want to update.', authenticated: true },
          { status: 400 }
        );
      }
      selectedForms = validateFormSelection([targetForm]);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid upload type. Choose either new upload or update upload.', authenticated: true },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    const validExtensions = ['csv', 'xlsx', 'xls', 'xlsm'];
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Upload a CSV or Excel file (.csv, .xlsx, .xls, .xlsm).', authenticated: true },
        { status: 400 }
      );
    }

    let rawData = [];
    try {
      if (fileExtension === 'csv') {
        rawData = await parseCSV(file);
      } else {
        rawData = await parseExcel(file);
      }
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: friendlyUploadError(error),
          authenticated: true,
          suggestion: 'Use the student template and make sure the first row contains admissionNumber, firstName, lastName, and form.'
        },
        { status: 400 }
      );
    }

    if (rawData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No student records were found in the file.', authenticated: true },
        { status: 400 }
      );
    }

    if (checkDuplicates) {
      const duplicates = uploadType === 'update'
        ? await checkDuplicateAdmissionNumbers(rawData, selectedForms[0])
        : await checkDuplicateAdmissionNumbers(rawData);

      return NextResponse.json({
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates,
        totalRows: rawData.length,
        newRows: Math.max(rawData.length - duplicates.length, 0),
        authenticated: true,
        uploadedBy: auth.user.name,
        message: duplicates.length > 0
          ? `Found ${duplicates.length} existing admission number(s).`
          : 'No duplicate admission numbers were found.'
      });
    }

    batchId = `BATCH_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const uploadBatch = await prisma.studentBulkUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy: auth.user.name,
        status: 'processing',
        totalRows: rawData.length,
        metadata: {
          uploadType,
          selectedForms,
          targetForm: uploadType === 'update' ? selectedForms[0] : null,
          duplicateAction,
          uploadedBy: auth.user.name,
          userRole: auth.user.role,
          startedAt: new Date().toISOString()
        }
      }
    });

    let processingStats;
    try {
      processingStats = uploadType === 'new'
        ? await processNewUpload(rawData, batchId, selectedForms, duplicateAction)
        : await processUpdateUpload(rawData, batchId, selectedForms[0]);

      await prisma.studentBulkUpload.update({
        where: { id: batchId },
        data: {
          status: 'completed',
          processedDate: new Date(),
          totalRows: processingStats.totalRows,
          validRows: processingStats.validRows,
          skippedRows: processingStats.skippedRows || 0,
          errorRows: processingStats.errorRows,
          errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 100) : undefined,
          metadata: {
            ...uploadBatch.metadata,
            updatedRows: processingStats.updatedRows || 0,
            createdRows: processingStats.createdRows || 0,
            deactivatedRows: processingStats.deactivatedRows || 0,
            completedAt: new Date().toISOString()
          }
        }
      });

      const finalStats = await refreshGlobalStudentStats();

      console.log(`✅ Student upload completed by ${auth.user.name}: ${processingStats.validRows} students processed`);

      return NextResponse.json({
        success: true,
        message: uploadType === 'new'
          ? `Upload complete. ${processingStats.createdRows || 0} student(s) added and ${processingStats.updatedRows || 0} updated.`
          : `Update complete for ${selectedForms[0]}. ${processingStats.updatedRows || 0} updated, ${processingStats.createdRows || 0} added, ${processingStats.deactivatedRows || 0} marked inactive.`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          status: 'completed',
          uploadType,
          selectedForms
        },
        stats: finalStats.stats,
        validation: finalStats.validation,
        processingStats,
        authenticated: true,
        uploadedBy: auth.user.name,
        errors: processingStats.errors.slice(0, 25),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Processing error:', error);

      if (batchId) {
        await prisma.studentBulkUpload.update({
          where: { id: batchId },
          data: {
            status: 'failed',
            processedDate: new Date(),
            errorRows: 1,
            errorLog: [friendlyUploadError(error)]
          }
        }).catch(updateError => {
          console.error('Failed to mark upload batch as failed:', updateError);
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: friendlyUploadError(error),
        authenticated: true,
        batchId,
        suggestion: 'Check that your file has the required columns: admissionNumber, firstName, lastName, form. If the file is very large, split it by form and try again.'
      },
      { status: 500 }
    );
  }
}


// PUT - Update student with transaction (PROTECTED - authentication required)
export async function PUT(request) {
  try {
    // Step 1: Authenticate the PUT request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student update request from: ${auth.user.name} (${auth.user.role})`);

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required', authenticated: true },
        { status: 400 }
      );
    }

    // Use transaction for consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get current student
      const currentStudent = await tx.databaseStudent.findUnique({
        where: { id }
      });

      if (!currentStudent) {
        throw new Error('Student not found');
      }

      // Check admission number uniqueness
      if (updateData.admissionNumber && updateData.admissionNumber !== currentStudent.admissionNumber) {
        const existing = await tx.databaseStudent.findFirst({
          where: {
            admissionNumber: updateData.admissionNumber,
            NOT: { id: id }
          }
        });

        if (existing) {
          throw new Error('Admission number already exists');
        }
      }

      // Parse date if provided
      if (updateData.dateOfBirth) {
        try {
          updateData.dateOfBirth = new Date(updateData.dateOfBirth);
          if (isNaN(updateData.dateOfBirth.getTime())) {
            throw new Error('Invalid date format');
          }
        } catch (dateError) {
          throw new Error('Invalid date format');
        }
      }

      // Update student with audit info
      const updatedStudent = await tx.databaseStudent.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
          
        }
      });

      // Update stats if form changed
      if (updateData.form && updateData.form !== currentStudent.form) {
        // Decrement count from old form
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            ...(currentStudent.form === 'Form 1' && { form1: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 2' && { form2: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 3' && { form3: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 4' && { form4: { decrement: 1 } })
          }
        });

        // Increment count to new form
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            ...(updateData.form === 'Form 1' && { form1: { increment: 1 } }),
            ...(updateData.form === 'Form 2' && { form2: { increment: 1 } }),
            ...(updateData.form === 'Form 3' && { form3: { increment: 1 } }),
            ...(updateData.form === 'Form 4' && { form4: { increment: 1 } })
          }
        });
      }

      return updatedStudent;
    });

    // Recalculate to ensure consistency
    const finalStats = await calculateStatistics({});

    console.log(`✅ Student updated by ${auth.user.name}: ${result.firstName} ${result.lastName}`);

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      data: {
        student: result,
        stats: finalStats.stats,
        validation: finalStats.validation
      },
      authenticated: true,

    });

  } catch (error) {
    console.error('PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Student not found', authenticated: true },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Update failed',
        authenticated: true
      },
      { status: 500 }
    );
  }
}

// DELETE - Student or batch with transaction (PROTECTED - authentication required)
export async function DELETE(request) {
  try {
    // Step 1: Authenticate the DELETE request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Student delete request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const studentId = url.searchParams.get('studentId');
    const hardDelete = url.searchParams.get('hardDelete') === 'true';

    if (batchId) {
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.studentBulkUpload.findUnique({
          where: { id: batchId }
        });

        if (!batch) {
          throw new Error('Batch not found');
        }

        const batchStudents = await tx.databaseStudent.findMany({
          where: { uploadBatchId: batchId },
          select: { form: true, status: true, admissionNumber: true }
        });

        const formCounts = batchStudents.reduce((acc, student) => {
          if (student.status === 'active') {
            acc[student.form] = (acc[student.form] || 0) + 1;
          }
          return acc;
        }, {});

        if (hardDelete) {
          // Hard delete students
          await tx.databaseStudent.deleteMany({
            where: { uploadBatchId: batchId }
          });

          await tx.studentPortalAccount.deleteMany({
            where: {
              admissionNumber: { in: batchStudents.map(student => student.admissionNumber) }
            }
          });
        } else {
          // Soft delete students (mark as inactive)
          await tx.databaseStudent.updateMany({
            where: { uploadBatchId: batchId },
            data: {
              status: 'inactive',
              updatedAt: new Date(),
              
            }
          });
        }

        // Update stats if hard deleting
        if (hardDelete) {
          await tx.studentStats.update({
            where: { id: 'global_stats' },
            data: {
              totalStudents: { decrement: batchStudents.length },
              form1: { decrement: formCounts['Form 1'] || 0 },
              form2: { decrement: formCounts['Form 2'] || 0 },
              form3: { decrement: formCounts['Form 3'] || 0 },
              form4: { decrement: formCounts['Form 4'] || 0 }
            }
          });
        }

        // Delete batch record
        await tx.studentBulkUpload.delete({
          where: { id: batchId }
        });

        return { 
          batch, 
          deletedCount: batchStudents.length,
          deletionType: hardDelete ? 'hard' : 'soft'
        };
      });

      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});

      console.log(`✅ Batch deleted by ${auth.user.name}: ${result.batch.fileName} (${result.deletedCount} students)`);

      return NextResponse.json({
        success: true,
        message: `${result.deletionType === 'hard' ? 'Hard deleted' : 'Soft deleted'} batch ${result.batch.fileName} and ${result.deletedCount} students`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation
        },
        authenticated: true,
      });
    }

    if (studentId) {
      const result = await prisma.$transaction(async (tx) => {
        const student = await tx.databaseStudent.findUnique({
          where: { id: studentId }
        });

        if (!student) {
          throw new Error('Student not found');
        }

        if (hardDelete) {
          // Hard delete student
          await tx.databaseStudent.delete({
            where: { id: studentId }
          });

          await tx.studentPortalAccount.deleteMany({
            where: { admissionNumber: student.admissionNumber }
          });

          // Update stats
          await tx.studentStats.update({
            where: { id: 'global_stats' },
            data: {
              totalStudents: { decrement: 1 },
              ...(student.form === 'Form 1' && { form1: { decrement: 1 } }),
              ...(student.form === 'Form 2' && { form2: { decrement: 1 } }),
              ...(student.form === 'Form 3' && { form3: { decrement: 1 } }),
              ...(student.form === 'Form 4' && { form4: { decrement: 1 } })
            }
          });
        } else {
          // Soft delete student (mark as inactive)
          await tx.databaseStudent.update({
            where: { id: studentId },
            data: {
              status: 'inactive',
              updatedAt: new Date(),
             
            }
          });
        }

        return { student, deletionType: hardDelete ? 'hard' : 'soft' };
      });

      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});

      console.log(`✅ Student deleted by ${auth.user.name}: ${result.student.firstName} ${result.student.lastName}`);

      return NextResponse.json({
        success: true,
        message: `${result.deletionType === 'hard' ? 'Hard deleted' : 'Soft deleted'} student ${result.student.firstName} ${result.student.lastName}`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation
        },
        authenticated: true,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide batchId or studentId', authenticated: true },
      { status: 400 }
    );

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed', authenticated: true },
      { status: 500 }
    );
  }
}

// PATCH - Reactivate inactive students (PROTECTED - authentication required)
export async function PATCH(request) {
  try {
    // Step 1: Authenticate the PATCH request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student reactivate request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    const batchId = url.searchParams.get('batchId');
    const form = url.searchParams.get('form');

    if (studentId) {
      // Reactivate single student
      const student = await prisma.databaseStudent.update({
        where: { id: studentId },
        data: {
          status: 'active',
          updatedAt: new Date(),
          
        }
      });

      console.log(`✅ Student reactivated by ${auth.user.name}: ${student.firstName} ${student.lastName}`);

      return NextResponse.json({
        success: true,
        message: `Student ${student.firstName} ${student.lastName} reactivated`,
        data: { student },
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    if (batchId) {
      // Reactivate all students in a batch
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.databaseStudent.updateMany({
          where: { 
            uploadBatchId: batchId,
            status: 'inactive'
          },
          data: {
            status: 'active',
            updatedAt: new Date(),
            
          }
        });

        // Update statistics
        const batchStudents = await tx.databaseStudent.findMany({
          where: { uploadBatchId: batchId },
          select: { form: true }
        });

        const formCounts = batchStudents.reduce((acc, student) => {
          acc[student.form] = (acc[student.form] || 0) + 1;
          return acc;
        }, {});

        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            totalStudents: { increment: updated.count },
            form1: { increment: formCounts['Form 1'] || 0 },
            form2: { increment: formCounts['Form 2'] || 0 },
            form3: { increment: formCounts['Form 3'] || 0 },
            form4: { increment: formCounts['Form 4'] || 0 }
          }
        });

        return { count: updated.count };
      });

      console.log(`✅ Batch reactivated by ${auth.user.name}: ${result.count} students`);

      return NextResponse.json({
        success: true,
        message: `Reactivated ${result.count} students from batch`,
        data: result,
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    if (form) {
      // Reactivate all inactive students in a form
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.databaseStudent.updateMany({
          where: { 
            form: form,
            status: 'inactive'
          },
          data: {
            status: 'active',
            updatedAt: new Date(),
            
          }
        });

        // Update statistics
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            totalStudents: { increment: updated.count },
            ...(form === 'Form 1' && { form1: { increment: updated.count } }),
            ...(form === 'Form 2' && { form2: { increment: updated.count } }),
            ...(form === 'Form 3' && { form3: { increment: updated.count } }),
            ...(form === 'Form 4' && { form4: { increment: updated.count } })
          }
        });

        return { count: updated.count };
      });

      console.log(`✅ Form reactivated by ${auth.user.name}: ${result.count} students in ${form}`);

      return NextResponse.json({
        success: true,
        message: `Reactivated ${result.count} students in ${form}`,
        data: result,
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide studentId, batchId, or form', authenticated: true },
      { status: 400 }
    );

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Reactivate failed', authenticated: true },
      { status: 500 }
    );
  }
}
