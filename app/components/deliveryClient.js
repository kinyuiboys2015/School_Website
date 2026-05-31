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
      throw new Error(data.error || data.message || `Request failed with HTTP ${response.status}`);
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

  let successCount = 0;
  const failedRecipients = [];

  for (let index = 0; index < recipients.length; index++) {
    const recipient = recipients[index];
    setProgress({
      phase: 'sending',
      active: true,
      current: index,
      total,
      percent: Math.round((index / total) * 100),
      statusText: `Sending to ${index + 1} of ${total} recipients...`,
      failedRecipients,
      entityId
    });

    try {
      const deliveryResult = await fetchJsonWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [entityIdKey]: entityId,
            recipientIds: [recipient.admissionNumber]
          })
        },
        60000
      );

      const resultRow = deliveryResult.data?.results?.[0];
      const failed = deliveryResult.data?.failureCount > 0 || resultRow?.success === false;
      if (failed) {
        failedRecipients.push(normalizeRecipientFailure(
          { ...recipient, email: resultRow?.email || recipient.email },
          resultRow?.error || deliveryResult.error || 'Delivery failed'
        ));
      } else {
        successCount += 1;
      }
    } catch (error) {
      failedRecipients.push(normalizeRecipientFailure(recipient, error.message));
    }

    setProgress({
      phase: 'sending',
      active: true,
      current: index + 1,
      total,
      percent: Math.round(((index + 1) / total) * 100),
      statusText: `Sending to ${index + 1} of ${total} recipients...`,
      failedRecipients,
      entityId
    });
  }

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
