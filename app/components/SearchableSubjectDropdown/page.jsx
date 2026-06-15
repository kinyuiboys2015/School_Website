"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiSearch } from "react-icons/fi";

export default function SearchableSubjectDropdown({
  value,
  onChange,
  options = [],
  label = "Subject",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      String(option).toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  const selectOption = (option) => {
    onChange(option);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
      >
        <span className="truncate">{value}</span>
        <FiChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3">
              <FiSearch className="h-4 w-4 text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search subjects..."
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div role="listbox" className="max-h-64 overflow-y-auto p-2">
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const selected = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => selectOption(option)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "bg-orange-50 font-bold text-orange-800"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{option}</span>
                    {selected && <FiCheck className="h-4 w-4" />}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-6 text-center text-sm text-slate-500">
                No matching subject found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
