'use client';

import { CircularProgress } from '@mui/material';
import { FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

export default function DeliveryProgressPanel({ progress, onRetry, disabled = false }) {
  if (!progress || progress.phase === 'idle') return null;

  const percent = Number.isFinite(progress.percent) ? Math.max(0, Math.min(100, progress.percent)) : 0;
  const failedRecipients = progress.failedRecipients || [];
  const isSuccess = progress.phase === 'success';
  const isFailed = progress.phase === 'failed';

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${
      isSuccess
        ? 'border-emerald-200 bg-emerald-50'
        : isFailed
        ? 'border-red-200 bg-red-50'
        : 'border-teal-200 bg-teal-50'
    }`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isSuccess
            ? 'bg-emerald-100 text-emerald-700'
            : isFailed
            ? 'bg-red-100 text-red-700'
            : 'bg-teal-100 text-teal-700'
        }`}>
          {isSuccess ? (
            <FiCheckCircle className="text-xl" />
          ) : isFailed ? (
            <FiAlertCircle className="text-xl" />
          ) : (
            <CircularProgress size={20} color="inherit" thickness={6} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={`text-sm font-black uppercase tracking-[0.18em] ${
                isSuccess ? 'text-emerald-700' : isFailed ? 'text-red-700' : 'text-teal-700'
              }`}>
                {isSuccess ? 'Delivery complete' : isFailed ? 'Delivery needs attention' : 'Email delivery in progress'}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {progress.statusText || 'Preparing email delivery...'}
              </p>
            </div>

            <div className="text-sm font-black text-slate-700">
              {progress.current || 0} / {progress.total || 0}
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFailed ? 'bg-red-500' : isSuccess ? 'bg-emerald-500' : 'bg-teal-600'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {isFailed && onRetry && failedRecipients.length === 0 && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-red-900">
                Delivery did not complete. You can retry the recipient lookup and send process.
              </p>
              <button
                type="button"
                onClick={onRetry}
                disabled={disabled}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiRefreshCw />
                Retry Delivery
              </button>
            </div>
          )}

          {failedRecipients.length > 0 && (
            <div className="mt-4 rounded-xl border border-red-200 bg-white p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-black text-red-800">
                  Failed recipients ({failedRecipients.length})
                </p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    disabled={disabled}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiRefreshCw />
                    Retry Failed
                  </button>
                )}
              </div>
              <div className="mt-3 max-h-36 space-y-2 overflow-y-auto">
                {failedRecipients.map((recipient) => (
                  <div key={`${recipient.admissionNumber}-${recipient.email || 'missing'}`} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-900">
                    <span>{recipient.studentName || recipient.admissionNumber || 'Unknown recipient'}</span>
                    {recipient.email && <span> - {recipient.email}</span>}
                    <span>: {recipient.error || 'Delivery failed'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
