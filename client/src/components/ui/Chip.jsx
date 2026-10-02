import React from 'react';

export default function Chip({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: "bg-primary text-on-primary",
    secondary: "bg-secondary text-on-secondary",
    tertiary: "bg-tertiary-container text-on-tertiary-container",
    surface: "bg-surface-container-high text-on-surface",
    secondaryFixed: "bg-secondary-fixed text-on-secondary-fixed"
  };
  return (
    <span className={`font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
