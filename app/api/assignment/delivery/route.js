import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "../../../../libs/prisma";
import { resolveDeliveryRecipients } from "../../../../libs/delivery";
import { normalizeEmailAddress, sendDeliveryEmail } from "../../../../libs/emailDelivery";

export const dynamic = "force-dynamic";

const decodeJwtPayload = (token) => {
  const payload = token.split('.')[1];
  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + ((4 - normalizedPayload.length % 4) % 4), '=');
  return JSON.parse(Buffer.from(paddedPayload, 'base64').toString('utf-8'));
};

const authenticateDeliveryRequest = (req) => {
  const adminToken = req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace('Bearer ', '');
  const deviceToken = req.headers.get('x-device-token');

  if (!adminToken || !deviceToken) {
    return {
      authenticated: false,
      response: NextResponse.json({ success: false, error: 'Access Denied', message: 'Admin and device tokens are required' }, { status: 401 })
    };
  }

  try {
    if (adminToken.split('.').length !== 3) throw new Error('Invalid admin token format');
    JSON.parse(Buffer.from(deviceToken, 'base64').toString('utf-8'));
    const adminPayload = decodeJwtPayload(adminToken);
    if (adminPayload.exp && adminPayload.exp < Date.now() / 1000) throw new Error('Admin token has expired');

    const userRole = String(adminPayload.role || adminPayload.userRole || '').toUpperCase();
    const validRoles = ['ADMIN', 'SUPER_ADMIN', 'ADMINISTRATOR', 'PRINCIPAL', 'TEACHER', 'STAFF'];
    if (!validRoles.includes(userRole)) {
      return {
        authenticated: false,
        response: NextResponse.json({ success: false, error: 'Access Denied', message: 'You do not have permission to send assignment delivery emails' }, { status: 403 })
      };
    }

    return { authenticated: true, user: adminPayload };
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json({ success: false, error: 'Access Denied', message: error.message || 'Invalid authentication headers' }, { status: 401 })
    };
  }
};

const buildAssignmentEmail = (assignment, studentName) => {
  const dueDateText = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'Check the student portal';
  const teacherName = assignment.teacher || 'The subject teacher';
  const classStream = assignment.className || 'Check the student portal';
  const subject = `New assignment: ${assignment.title}`;
  const text = [
    'Dear Parent/Guardian,',
    '',
    `A new assignment has been shared for ${studentName}.`,
    `Title: ${assignment.title}`,
    `Subject: ${assignment.subject}`,
    `Teacher: ${teacherName}`,
    `Class / Stream: ${classStream}`,
    `Due: ${dueDateText}`,
    '',
    `Instructions: ${assignment.description || 'Please check the student portal for details.'}`,
    '',
    'Regards,',
    'Kinyui Boys School'
  ].join('\n');
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <p>Dear Parent/Guardian,</p>
      <p>A new assignment has been shared for <strong>${studentName}</strong>.</p>
      <ul>
        <li><strong>Title:</strong> ${assignment.title}</li>
        <li><strong>Subject:</strong> ${assignment.subject}</li>
        <li><strong>Teacher:</strong> ${teacherName}</li>
        <li><strong>Class / Stream:</strong> ${classStream}</li>
        <li><strong>Due:</strong> ${dueDateText}</li>
      </ul>
      <p><strong>Instructions:</strong> ${assignment.description || 'Please check the student portal for details.'}</p>
      <p>Regards,<br/>Kinyui Boys School</p>
    </div>
  `;

  return { subject, text, html };
};

const attachmentFromUrl = (url, fallbackName = 'attachment') => {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.split('?')[0];
  const filename = decodeURIComponent(cleanUrl.split('/').pop() || fallbackName);
  if (/^https?:\/\//i.test(url)) return { filename, path: url };
  const publicPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
  return { filename, path: path.join(process.cwd(), 'public', publicPath) };
};

const buildAssignmentAttachments = (assignment) => [
  ...(Array.isArray(assignment.assignmentFiles) ? assignment.assignmentFiles : []),
  ...(Array.isArray(assignment.attachments) ? assignment.attachments : []),
].map((url, index) => attachmentFromUrl(url, `assignment-file-${index + 1}`)).filter(Boolean);

const getAssignmentRecipients = async (assignment, admissionNumbers = []) => {
  const resolved = await resolveDeliveryRecipients({
    channel: 'email',
    classes: [assignment.className].filter(Boolean),
    grades: [assignment.className].filter(Boolean)
  });
  const filterSet = new Set((admissionNumbers || []).map(String).filter(Boolean));
  const recipients = filterSet.size
    ? resolved.recipients.filter(recipient => filterSet.has(String(recipient.admissionNumber)))
    : resolved.recipients;
  return { ...resolved, recipients };
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const assignmentId = Number(searchParams.get("assignmentId"));
    if (!assignmentId) return NextResponse.json({ success: false, error: "Assignment ID is required" }, { status: 400 });

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });

    const resolved = await getAssignmentRecipients(assignment);
    return NextResponse.json({
      success: true,
      data: resolved.recipients,
      count: resolved.recipients.length,
      missingEmailCount: resolved.missingEmailCount,
      totalMatchedStudents: resolved.totalMatched
    });
  } catch (error) {
    console.error("Error resolving assignment delivery recipients:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = authenticateDeliveryRequest(req);
    if (!auth.authenticated) return auth.response;

    const body = await req.json();
    const assignmentId = Number(body.assignmentId);
    const recipientIds = Array.isArray(body.recipientIds) ? body.recipientIds : [];
    if (!assignmentId) return NextResponse.json({ success: false, error: "Assignment ID is required" }, { status: 400 });

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });

    const resolved = await getAssignmentRecipients(assignment, recipientIds);
    const sendResults = [];
    let successCount = 0;
    let failureCount = 0;

    for (const recipient of resolved.recipients) {
      const parentEmail = normalizeEmailAddress(recipient.email);
      if (!parentEmail) {
        failureCount++;
        sendResults.push({ admissionNumber: recipient.admissionNumber, studentName: recipient.studentName, success: false, error: "No parent email address available" });
        continue;
      }

      const sendResult = await sendDeliveryEmail({
        to: parentEmail,
        ...buildAssignmentEmail(assignment, recipient.studentName || 'Student'),
        attachments: buildAssignmentAttachments(assignment)
      });

      if (sendResult.fatal) {
        return NextResponse.json({
          success: false,
          error: sendResult.error,
          code: sendResult.code,
          message: sendResult.error,
          data: {
            successCount,
            failureCount: failureCount + 1,
            totalRecipients: resolved.recipients.length,
            missingEmailCount: resolved.missingEmailCount,
            results: [
              ...sendResults,
              { admissionNumber: recipient.admissionNumber, studentName: recipient.studentName, email: parentEmail, ...sendResult }
            ]
          }
        }, { status: sendResult.code === 'SENDER_AUTH_RATE_LIMITED' ? 429 : 500 });
      }

      if (sendResult.success) successCount++;
      else failureCount++;
      sendResults.push({ admissionNumber: recipient.admissionNumber, studentName: recipient.studentName, email: parentEmail, ...sendResult });
    }

    return NextResponse.json({
      success: true,
      message: `Email delivery completed. ${successCount} sent, ${failureCount} failed`,
      data: { successCount, failureCount, totalRecipients: resolved.recipients.length, missingEmailCount: resolved.missingEmailCount, results: sendResults }
    });
  } catch (error) {
    console.error("Error sending assignment delivery emails:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  return POST(req);
}
