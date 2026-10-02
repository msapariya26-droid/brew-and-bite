import { createContext, useState, useContext } from 'react';

const PreorderContext = createContext();

export function PreorderProvider({ children }) {
  const [items, setItems] = useState([]);
  
  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (itemToRemove) => {
    setItems((prev) => {
      const idx = prev.findIndex(i => i.id === itemToRemove.id);
      if (idx > -1) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return prev;
    });
  };
  
  return (
    <PreorderContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </PreorderContext.Provider>
  );
}

export const usePreorder = () => useContext(PreorderContext);
