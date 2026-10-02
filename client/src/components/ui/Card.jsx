import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(31,25,22,0.06)] ${className}`} {...props}>
      {children}
    </div>
  );
}
