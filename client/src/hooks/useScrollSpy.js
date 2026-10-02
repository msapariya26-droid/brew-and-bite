import { useState, useEffect } from 'react';

export function useScrollSpy(ids, offset = 150) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const handleScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - offset) {
          current = id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids, offset]);

  return activeId;
}
