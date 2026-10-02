import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ message = "Service unavailable" }) {
  return (
    <div className="flex flex-col items-center justify-center p-space-xl text-center">
      <AlertCircle size={48} className="text-error mb-2" />
      <h3 className="font-headline-sm text-on-surface">Oops</h3>
      <p className="font-body-md text-on-surface-variant">{message}</p>
    </div>
  );
}
