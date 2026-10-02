import React from 'react';

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) {
  const base = "inline-flex items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 shadow-sm";
  const variants = {
    primary: "bg-primary text-on-primary",
    secondary: "bg-secondary text-on-secondary",
    inverted: "bg-surface-container-high text-on-surface",
    outlined: "bg-transparent border border-line text-primary hover:bg-surface-container"
  };
  
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
