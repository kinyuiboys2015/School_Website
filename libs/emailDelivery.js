import nodemailer from 'nodemailer';

export const normalizeEmailAddress = (value = '') => {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('Email delivery is not configured. Set EMAIL_USER and EMAIL_PASS.');
  }

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: { user, pass }
  });
};

export const sendDeliveryEmail = async ({ to, subject, text, html, attachments = [] }) => {
  const normalizedTo = normalizeEmailAddress(to);
  if (!normalizedTo) {
    return { success: false, error: 'Invalid recipient email address' };
  }

  try {
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
    const info = await transporter.sendMail({
      from,
      to: normalizedTo,
      subject,
      text,
      html,
      attachments
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Delivery email failed:', error);
    return { success: false, error: error.message || 'Email delivery failed' };
  }
};
