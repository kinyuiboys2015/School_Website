import { prisma } from './prisma';

export const ACADEMIC_LEVEL_OPTIONS = ['Grade 10', 'Grade 11', 'Grade 12', 'Form 3', 'Form 4'];
export const SCHOOL_COMMUNICATION_NUMBER = '0793472960';
export const SCHOOL_COMMUNICATION_EMAIL = process.env.SCHOOL_COMMUNICATION_EMAIL || process.env.CONTACT_EMAIL || 'kinyuiboys2015@gmail.com';

const asArray = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;

  const text = String(value).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Treat as a comma-separated or single form value below.
  }

  return text.split(',').map(item => item.trim()).filter(Boolean);
};

export const normalizeAcademicLevel = (value = '') => {
  const text = String(value || '').trim();
  if (!text) return '';

  const compact = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const map = {
    grade10: 'Grade 10',
    g10: 'Grade 10',
    10: 'Grade 10',
    grade11: 'Grade 11',
    g11: 'Grade 11',
    11: 'Grade 11',
    grade12: 'Grade 12',
    g12: 'Grade 12',
    12: 'Grade 12',
    form3: 'Form 3',
    f3: 'Form 3',
    3: 'Form 3',
    form4: 'Form 4',
    f4: 'Form 4',
    4: 'Form 4'
  };

  if (!map[compact]) {
    const embeddedLevel = text.match(/\b(grade\s*1[0-2]|g\s*1[0-2]|form\s*[3-4]|f\s*[3-4])\b/i);
    if (embeddedLevel) {
      const embeddedCompact = embeddedLevel[1].toLowerCase().replace(/[^a-z0-9]/g, '');
      return map[embeddedCompact] || embeddedLevel[1];
    }
  }

  return map[compact] || text;
};

const uniqueClean = (items) => [...new Set(items.map(item => String(item || '').trim()).filter(Boolean))];

export const buildDeliveryCriteriaFromFormData = (formData, fallbackClassName = '', fallbackCategory = '') => {
  const grades = uniqueClean(formData.getAll('targetGrades').flatMap(asArray).map(normalizeAcademicLevel));
  const explicitClasses = uniqueClean(formData.getAll('targetClasses').flatMap(asArray));
  const categories = uniqueClean([
    ...formData.getAll('targetCategories').flatMap(asArray),
    ...asArray(fallbackCategory)
  ]);
  const studentIds = uniqueClean(formData.getAll('studentIds').flatMap(asArray));
  const classes = explicitClasses.length
    ? explicitClasses
    : uniqueClean(asArray(fallbackClassName));

  return {
    channel: 'email',
    senderReference: String(formData.get('senderReference') || SCHOOL_COMMUNICATION_NUMBER).trim(),
    grades,
    classes,
    categories,
    studentIds
  };
};

const buildStudentName = (student = {}) =>
  [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildStudentWhere = (criteria = {}) => {
  const OR = [];
  const ids = uniqueClean(criteria.studentIds || []);
  const grades = uniqueClean((criteria.grades || []).map(normalizeAcademicLevel));
  const classes = uniqueClean(criteria.classes || []);
  const categories = uniqueClean(criteria.categories || []);

  if (ids.length) OR.push({ id: { in: ids } });
  if (grades.length) OR.push({ form: { in: grades } });

  for (const className of classes) {
    const normalizedClass = normalizeAcademicLevel(className);
    const stream = String(className).replace(new RegExp(normalizedClass.replace(/\s+/g, '\\s*'), 'i'), '').trim();
    OR.push({
      AND: [
        { form: normalizedClass },
        ...(stream ? [{ stream: { contains: stream } }] : [])
      ]
    });
  }

  if (categories.length) {
    const normalizedCategories = categories.map(normalizeAcademicLevel);
    OR.push({ form: { in: normalizedCategories } });
  }

  return {
    status: 'active',
    ...(OR.length ? { OR } : {})
  };
};

export const resolveDeliveryRecipients = async (criteria = {}, client = prisma) => {
  const students = await client.databaseStudent.findMany({
    where: buildStudentWhere(criteria),
    orderBy: [{ form: 'asc' }, { stream: 'asc' }, { firstName: 'asc' }],
    select: {
      id: true,
      admissionNumber: true,
      firstName: true,
      middleName: true,
      lastName: true,
      form: true,
      stream: true,
      email: true
    }
  });

  const recipients = students
    .filter(student => student.admissionNumber)
    .map(student => ({
      studentId: student.id,
      admissionNumber: student.admissionNumber,
      studentName: buildStudentName(student),
      email: student.email || null,
      form: student.form,
      stream: student.stream
    }));

  return {
    recipients,
    totalMatched: students.length,
    missingEmailCount: recipients.filter(recipient => !recipient.email).length
  };
};
