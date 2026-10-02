import React from 'react';
import { motion } from 'motion/react';

export default function Tabs({ categories, activeTab, onChange }) {
  return (
    <div className="flex items-center justify-start gap-2 overflow-x-auto pb-1 no-scrollbar" role="tablist">
      {categories.map((cat) => {
        const isActive = activeTab === cat.id;
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className={`relative px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5 z-10 ${
              isActive ? 'text-on-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-primary rounded-full shadow-sm"
                transition={{ duration: 0.3, ease: [0.22, 0.8, 0.24, 1] }}
                style={{ zIndex: -1 }}
              />
            )}
            <span>{cat.icon}</span> <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
