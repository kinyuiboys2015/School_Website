import nodemailer from 'nodemailer';

let cachedTransporter = null;
let cachedTransportKey = '';

export const normalizeEmailAddress = (value = '') => {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

const isSenderAuthRateLimited = (error) => {
  const message = `${error?.message || ''}\n${error?.response || ''}`;
  return error?.code === 'EAUTH' &&
    (error?.responseCode === 454 || message.includes('Too many login attempts'));
};

export const getFriendlyEmailError = (error) => {
  if (isSenderAuthRateLimited(error)) {
    return {
      code: 'SENDER_AUTH_RATE_LIMITED',
      fatal: true,
      message: 'Gmail temporarily blocked the sender login because there were too many authentication attempts. Wait a while before retrying, and make sure EMAIL_USER/EMAIL_PASS use a valid Gmail app password.'
    };
  }

  if (error?.code === 'EAUTH') {
    return {
      code: 'SENDER_AUTH_FAILED',
      fatal: true,
      message: 'Email sender authentication failed. Check EMAIL_USER and EMAIL_PASS, and use a Gmail app password if this is a Gmail account.'
    };
  }

  return {
    code: error?.code || 'EMAIL_DELIVERY_FAILED',
    fatal: false,
    message: error?.message || 'Email delivery failed'
  };
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const transportKey = JSON.stringify({ host, port, user, service: host ? 'smtp' : 'gmail' });

  if (!user || !pass) {
    throw new Error('Email delivery is not configured. Set EMAIL_USER and EMAIL_PASS.');
  }

  if (cachedTransporter && cachedTransportKey === transportKey) {
    return cachedTransporter;
  }

  if (host) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      pool: true,
      maxConnections: 1,
      maxMessages: 100,
      auth: { user, pass }
    });
    cachedTransportKey = transportKey;
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    service: 'Gmail',
    pool: true,
    maxConnections: 1,
    maxMessages: 100,
    auth: { user, pass }
  });
  cachedTransportKey = transportKey;
  return cachedTransporter;
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
    const friendlyError = getFriendlyEmailError(error);
    return {
      success: false,
      error: friendlyError.message,
      code: friendlyError.code,
      fatal: friendlyError.fatal
    };
  }
};
