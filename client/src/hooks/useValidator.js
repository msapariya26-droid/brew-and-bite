import { useState, useEffect } from 'react';
import { initValidator, validateName, validateEmail, validatePhone } from '../lib/validator';

export function useValidator() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initValidator()
      .then(() => {
        setReady(true);
        setError(null);
      })
      .catch((err) => {
        setReady(false);
        setError(err.message || 'Failed to load WASM validation module');
      });
  }, []);

  return {
    ready,
    error,
    validateName,
    validateEmail,
    validatePhone
  };
}
