import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../../config/site';
import { Menu } from 'lucide-react';
import Button from '../ui/Button';
import { usePreorder } from '../../context/PreorderContext';

export default function Header({ activeSection, onMenuClick }) {
  const { items } = usePreorder();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.8, 0.24, 1] }}
      className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(31,25,22,0.05)]"
      id="top"
    >
      <div className="h-20 px-margin-mobile lg:px-margin flex items-center justify-between gap-space-sm max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-space-sm min-w-0">
          <img src="/images/logo.png" alt={`${siteConfig.name} Logo`} className="h-8 w-auto object-contain flex-shrink-0 bg-primary-fixed rounded-full p-1" onError={(e) => e.target.style.display='none'} />
          <div className="flex flex-col min-w-0">
            <span className="font-title-md text-[17.6px] text-on-surface truncate tracking-tight">{siteConfig.name}</span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest truncate">Artisanal Kitchen & Roastery</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-space-lg">
          <a href="#home" className={`font-label-md transition-colors ${activeSection === 'home' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'}`}>Home</a>
          <a href="#menu" className={`font-label-md transition-colors ${activeSection === 'menu' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'}`}>Menu</a>
          <a href="#specials" className={`font-label-md transition-colors ${activeSection === 'specials' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'}`}>Specials</a>
          <a href="#visit" className={`font-label-md transition-colors ${activeSection === 'visit' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'}`}>Visit</a>
        </nav>

        <div className="flex items-center gap-space-xs">
          <Button variant="secondary" className="hidden lg:inline-flex relative px-space-md h-10 font-label-md shadow-sm" onClick={() => document.getElementById('book').scrollIntoView()}>
            Reserve
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                {items.length}
              </span>
            )}
          </Button>
          <button type="button" onClick={onMenuClick} aria-label="Navigation Menu" className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary transition-colors rounded-full lg:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
