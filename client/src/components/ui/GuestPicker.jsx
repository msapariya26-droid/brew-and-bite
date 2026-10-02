import React from 'react';

export default function GuestPicker({ value, onChange, error }) {
  const options = [
    { value: 0, label: '1 - 2' },
    { value: 1, label: '3 - 4' },
    { value: 2, label: '5 - 6' },
    { value: 3, label: '7+' }
  ];

  return (
    <div className="flex flex-col gap-1" role="radiogroup">
      <label className="font-label-md text-label-md text-on-surface-variant">Number of Guests</label>
      <div className="grid grid-cols-4 gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center justify-center h-10 rounded-lg font-label-md text-label-md cursor-pointer transition-colors ${
              value === opt.value
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface'
            }`}
          >
            <input
              type="radio"
              name="guests"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="font-label-sm text-error">{error}</span>}
    </div>
  );
}
