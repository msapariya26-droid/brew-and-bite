import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Tabs from '../ui/Tabs';
import { usePreorder } from '../../context/PreorderContext';
import { Plus } from 'lucide-react';
import ErrorState from '../ui/ErrorState';
import { fetchMenu } from '../../lib/api';
import { formatPrice } from '../../lib/format';

const CATEGORIES = [
  { id: 'burgers', label: 'Gourmet Burgers', icon: '🍔' },
  { id: 'pizzas', label: 'Sourdough Pizzas', icon: '🍕' },
  { id: 'coffee', label: 'Brews & Coffee', icon: '☕' },
  { id: 'desserts', label: 'Desserts', icon: '🍰' }
];

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState('burgers');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = usePreorder();
  const [addedId, setAddedId] = useState(null);

  const handleAdd = (item) => {
    addItem(item);
    setAddedId(item.id);
    setTimeout(() => {
      document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
    }, 600);
    setTimeout(() => {
      setAddedId(null);
    }, 2000);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMenu()
      .then(items => {
        setMenuItems(items);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const items = menuItems.filter(i => i.category === activeTab);

  return (
    <section id="menu" className="flex flex-col px-margin-mobile py-space-md gap-space-md xl:max-w-7xl xl:mx-auto w-full">
      <div className="flex flex-col text-center items-center gap-space-xs">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">Artisanal Menu</span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Crafted with Sincerity</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">Tap categories below to filter our scratch-made offerings</p>
      </div>

      <Tabs categories={CATEGORIES} activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="flex items-center justify-center py-space-xl text-secondary">
          <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-space-md mt-2"
          >
            {items.map(item => (
              <div key={item.id} className="bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_4px_20px_rgba(31,25,22,0.06)] flex gap-space-md items-center group border border-transparent hover:-translate-y-1 hover:border-secondary hover:shadow-lg active:scale-[0.98] transition-all duration-300">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23eae8e4'%3E%3Crect width='400' height='300'/%3E%3C/svg%3E"; }}/>
                  {item.tag && <span className="absolute top-1 left-1 bg-secondary text-on-secondary font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">{item.tag}</span>}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-title-md text-title-md text-on-surface truncate">{item.name}</h4>
                    <span className="font-title-md text-title-md text-secondary font-bold flex-shrink-0">{formatPrice(item.price)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{item.note}</span>
                    <button 
                      type="button" 
                      onClick={() => handleAdd(item)}
                      className={`h-7 rounded-full flex items-center justify-center text-on-surface transition-all duration-300 ${addedId === item.id ? 'bg-secondary text-on-secondary px-2 text-[10px] font-bold animate-pulse' : 'w-7 bg-surface-container group-hover:bg-secondary group-hover:text-on-secondary hover:scale-110 active:scale-95'}`}
                    >
                      {addedId === item.id ? 'Added' : <Plus size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
