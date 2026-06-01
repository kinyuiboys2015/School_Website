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
        response: NextResponse.json({ success: false, error: 'Access Denied', message: 'You do not have permission to send resource delivery emails' }, { status: 403 })
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

const buildResourceEmail = (resource, studentName) => {
  const subject = `New learning resource: ${resource.title}`;
  const text = [
    'Dear Parent/Guardian,',
    '',
    `A new learning resource has been shared for ${studentName}.`,
    `Title: ${resource.title}`,
    `Subject: ${resource.subject}`,
    '',
    `Description: ${resource.description || 'Please check the student portal for details.'}`,
    '',
    'Regards,',
    'Kinyui Boys School'
  ].join('\n');
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <p>Dear Parent/Guardian,</p>
      <p>A new learning resource has been shared for <strong>${studentName}</strong>.</p>
      <ul>
        <li><strong>Title:</strong> ${resource.title}</li>
        <li><strong>Subject:</strong> ${resource.subject}</li>
      </ul>
      <p><strong>Description:</strong> ${resource.description || 'Please check the student portal for details.'}</p>
      <p>Regards,<br/>Kinyui Boys School</p>
    </div>
  `;

  return { subject, text, html };
};

const attachmentFromResourceFile = (file, fallbackName = 'resource-file') => {
  if (!file) return null;
  const url = typeof file === 'string' ? file : file.url;
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.split('?')[0];
  const filename = typeof file === 'object' && file.name
    ? file.name
    : decodeURIComponent(cleanUrl.split('/').pop() || fallbackName);
  if (/^https?:\/\//i.test(url)) return { filename, path: url };
  const publicPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
  return { filename, path: path.join(process.cwd(), 'public', publicPath) };
};

const buildResourceAttachments = (resource) => (Array.isArray(resource.files) ? resource.files : [])
  .map((file, index) => attachmentFromResourceFile(file, `resource-file-${index + 1}`))
  .filter(Boolean);

const getResourceRecipients = async (resource, admissionNumbers = []) => {
  const resolved = await resolveDeliveryRecipients({
    channel: 'email',
    classes: [resource.className].filter(Boolean),
    grades: [resource.className].filter(Boolean),
    categories: [resource.category].filter(Boolean)
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
    const resourceId = Number(searchParams.get("resourceId"));
    if (!resourceId) return NextResponse.json({ success: false, error: "Resource ID is required" }, { status: 400 });

    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });

    const resolved = await getResourceRecipients(resource);
    return NextResponse.json({
      success: true,
      data: resolved.recipients,
      count: resolved.recipients.length,
      missingEmailCount: resolved.missingEmailCount,
      totalMatchedStudents: resolved.totalMatched
    });
  } catch (error) {
    console.error("Error resolving resource delivery recipients:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = authenticateDeliveryRequest(req);
    if (!auth.authenticated) return auth.response;

    const body = await req.json();
    const resourceId = Number(body.resourceId);
    const recipientIds = Array.isArray(body.recipientIds) ? body.recipientIds : [];
    if (!resourceId) return NextResponse.json({ success: false, error: "Resource ID is required" }, { status: 400 });

    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });

    const resolved = await getResourceRecipients(resource, recipientIds);
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
        ...buildResourceEmail(resource, recipient.studentName || 'Student'),
        attachments: buildResourceAttachments(resource)
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
    console.error("Error sending resource delivery emails:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  return POST(req);
}
