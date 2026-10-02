import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Utensils, Sparkles, Calendar, Store } from 'lucide-react';
import { usePreorder } from '../../context/PreorderContext';

export default function BottomNav({ activeSection }) {
  const { items } = usePreorder();
  const navItems = [
    { id: 'home', icon: Coffee, label: 'Home' },
    { id: 'menu', icon: Utensils, label: 'Menu' },
    { id: 'specials', icon: Sparkles, label: 'Specials' },
    { id: 'book', icon: Calendar, label: 'Book' },
    { id: 'visit', icon: Store, label: 'Visit' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_16px_rgba(31,25,22,0.06)] lg:hidden">
      <div className="flex justify-around items-center h-20 px-space-sm">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative flex flex-col items-center justify-center gap-1 w-14 h-14 transition-colors ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`}
            >
              {item.id === 'book' && items.length > 0 && (
                <span className="absolute top-1 right-2 z-10 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                  {items.length}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 m-auto w-12 h-12 bg-primary rounded-full shadow-md"
                  transition={{ duration: 0.3, ease: [0.22, 0.8, 0.24, 1] }}
                  style={{ zIndex: -1 }}
                />
              )}
              <item.icon size={22} className={isActive ? 'text-on-primary' : 'text-on-surface-variant'} />
              {!isActive && <span className="font-label-sm text-label-sm">{item.label}</span>}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
