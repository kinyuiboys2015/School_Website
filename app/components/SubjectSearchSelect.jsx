'use client';

import { useMemo, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SubjectSearchSelect({
  value,
  onChange,
  options,
  disabled = false,
  label = 'Subject',
  required = false
}) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) return options;
    return options.filter((subject) =>
      subject.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, options]);

  return (
    <div>
      <label className="block text-base font-bold text-gray-800 mb-3">
        {label}{required ? ' *' : ''}
      </label>
      <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 border border-slate-200">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={disabled}
            placeholder="Search CBC or 8-4-4 subject..."
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              disabled={disabled}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              aria-label="Clear subject search"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="mt-3 max-h-48 overflow-y-auto pr-1">
          {filteredOptions.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredOptions.map((subject) => {
                const selected = value === subject;
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => onChange(subject)}
                    disabled={disabled}
                    className={`rounded-xl border px-3 py-2 text-left text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected
                        ? 'border-teal-500 bg-teal-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-sm font-bold text-slate-500">
              No subjects match "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
