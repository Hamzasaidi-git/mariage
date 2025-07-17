import { useState, useEffect } from 'react';

/**
 * Hook pour débouncer une valeur
 * Utile pour éviter les appels API trop fréquents lors de la saisie
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;