export const createIdleDeliveryProgress = () => ({
  phase: 'idle',
  active: false,
  current: 0,
  total: 0,
  percent: 0,
  statusText: '',
  failedRecipients: [],
  entityId: null
});

const fetchJsonWithTimeout = async (url, options = {}, timeoutMs = 45000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || data.message || `Request failed with HTTP ${response.status}`);
      error.status = response.status;
      error.code = data.code;
      error.data = data.data;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The email request timed out. Please retry the failed recipients.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const normalizeRecipientFailure = (recipient, error) => ({
  admissionNumber: recipient.admissionNumber,
  studentName: recipient.studentName,
  email: recipient.email,
  error: error || 'Delivery failed'
});

export const runRecipientDelivery = async ({
  endpoint,
  entityIdKey,
  entityId,
  headers,
  setProgress,
  recipientIds = null,
  knownRecipients = null,
  label = 'emails'
}) => {
  setProgress({
    phase: 'resolving',
    active: true,
    current: 0,
    total: 0,
    percent: 5,
    statusText: 'Preparing delivery recipients...',
    failedRecipients: [],
    entityId
  });

  let recipients = knownRecipients;
  if (!recipients) {
    const recipientData = await fetchJsonWithTimeout(
      `${endpoint}?${entityIdKey}=${encodeURIComponent(entityId)}`,
      { method: 'GET' },
      20000
    );
    recipients = Array.isArray(recipientData.data) ? recipientData.data : [];
  }

  if (recipientIds?.length) {
    const retrySet = new Set(recipientIds.map(String));
    recipients = recipients.filter((recipient) => retrySet.has(String(recipient.admissionNumber)));
  }

  const total = recipients.length;
  if (total === 0) {
    const emptyProgress = {
      phase: 'success',
      active: false,
      current: 0,
      total: 0,
      percent: 100,
      statusText: 'No matching delivery recipients were found.',
      failedRecipients: [],
      entityId
    };
    setProgress(emptyProgress);
    return { successCount: 0, failureCount: 0, totalRecipients: 0, failedRecipients: [] };
  }

  setProgress({
    phase: 'sending',
    active: true,
    current: 0,
    total,
    percent: 25,
    statusText: `Sending to ${total} recipient(s) in one secure email batch...`,
    failedRecipients: [],
    entityId
  });

  let deliveryResult;
  try {
    deliveryResult = await fetchJsonWithTimeout(
      endpoint,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [entityIdKey]: entityId,
          recipientIds: recipients.map((recipient) => recipient.admissionNumber).filter(Boolean)
        })
      },
      Math.max(60000, total * 15000)
    );
  } catch (error) {
    const apiResults = Array.isArray(error.data?.results) ? error.data.results : [];
    const failedRecipients = apiResults
      .filter((result) => result.success === false)
      .map((result) => normalizeRecipientFailure(result, result.error || error.message));

    setProgress({
      phase: 'failed',
      active: false,
      current: error.data?.successCount || 0,
      total,
      percent: 100,
      statusText: error.code === 'SENDER_AUTH_RATE_LIMITED'
        ? 'Gmail temporarily blocked the sender login. Wait before retrying and verify the sender app password.'
        : error.message,
      failedRecipients,
      entityId
    });

    throw error;
  }

  const results = Array.isArray(deliveryResult.data?.results) ? deliveryResult.data.results : [];
  const failedRecipients = results
    .filter((result) => result.success === false)
    .map((result) => normalizeRecipientFailure(result, result.error || 'Delivery failed'));
  const successCount = Number(deliveryResult.data?.successCount || 0);

  const failureCount = failedRecipients.length;
  const completedProgress = {
    phase: failureCount > 0 ? 'failed' : 'success',
    active: false,
    current: total,
    total,
    percent: 100,
    statusText: failureCount > 0
      ? `${successCount} ${label} sent. ${failureCount} recipient(s) failed.`
      : `Delivered ${label} to all ${total} recipient(s).`,
    failedRecipients,
    entityId
  };
  setProgress(completedProgress);

  return { successCount, failureCount, totalRecipients: total, failedRecipients };
};
