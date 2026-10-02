import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose, activeSection }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Focus trap logic
      if (e.key === 'Tab' && isOpen && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'a[href], button, textarea, input, select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // prevent scrolling behind menu
      
      // Focus first element after opening
      setTimeout(() => {
        if (menuRef.current) {
          const closeButton = menuRef.current.querySelector('button');
          if (closeButton) closeButton.focus();
        }
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'specials', label: 'Specials' },
    { id: 'book', label: 'Reserve' },
    { id: 'visit', label: 'Visit' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.4, ease: [0.22, 0.8, 0.24, 1] }}
          className="fixed inset-0 z-[60] bg-surface-container flex flex-col lg:hidden"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="flex justify-end p-space-md">
            <button 
              onClick={onClose} 
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary rounded-full active:scale-95 transition-transform"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col px-margin-mobile pt-space-xl gap-space-lg">
            {links.map(link => {
              const isActive = activeSection === link.id;
              return (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={onClose} 
                  className={`font-headline-md text-headline-md transition-colors ${isActive ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'}`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
