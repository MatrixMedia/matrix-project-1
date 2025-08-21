import { useState, useEffect } from 'react';

const useDebounce = () => {
  const [searchTerm, setSearchTerm] = useState(null);
  const [delay, setDelay] = useState(1000);
  const [debouncedValue, setDebouncedValue] = useState(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, delay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm, delay]);

  return { debouncedValue,searchTerm, setSearchTerm, setDelay };
};


export default useDebounce;
