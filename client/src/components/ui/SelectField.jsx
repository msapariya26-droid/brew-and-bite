import React from 'react';

export default function SelectField({ label, options, error, required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-label-md text-label-md text-on-surface-variant">
        {label} {required && '*'}
      </label>
      <select
        className={`h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-highest transition-colors ${error ? 'border border-error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id || props.name}-error` : undefined}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value || opt.label} disabled={opt.disabled}>{opt.label}</option>
        ))}
      </select>
      {error && <span id={`${props.id || props.name}-error`} className="font-label-sm text-error" aria-live="polite">{error}</span>}
    </div>
  );
}
