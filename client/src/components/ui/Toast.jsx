import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message, visible }) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md shadow-2xl transition-opacity duration-300 z-50 flex items-center gap-2 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <CheckCircle size={18} className="text-secondary" />
      <span>{message}</span>
    </div>
  );
}
