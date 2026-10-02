import React from 'react';
import { siteConfig } from '../../config/site';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDay();
  const isWeekend = currentDay === 0 || currentDay === 6;
  
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl px-margin-mobile py-space-xl pb-28 lg:pb-space-xl">
      <div className="flex flex-col gap-space-md max-w-lg mx-auto">
        <div className="flex flex-col gap-space-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{siteConfig.name}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Slow-fermented bakehouse & single-origin espresso sanctum.</p>
        </div>
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-start gap-space-xs text-on-surface-variant">
            <MapPin size={18} className="text-secondary mt-0.5" />
            <span className="font-body-sm text-body-sm">{siteConfig.address}</span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <Phone size={18} className="text-secondary" />
            <span className="font-body-sm text-body-sm">{siteConfig.phone}</span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <Mail size={18} className="text-secondary" />
            <span className="font-body-sm text-body-sm">{siteConfig.email}</span>
          </div>
        </div>
        
        <div className="bg-surface-container rounded-lg p-space-md flex flex-col gap-space-xs">
          <span className="font-label-md text-label-md text-secondary uppercase">Opening Hours</span>
          {siteConfig.hours.map((h, i) => {
            const isToday = (isWeekend && h.label.includes('Sat')) || (!isWeekend && h.label.includes('Mon'));
            return (
              <div key={i} className={`flex justify-between items-center ${isToday ? 'bg-secondary-fixed/50 -mx-2 px-2 py-1 rounded-md' : 'py-1'}`}>
                <span className={`font-body-sm text-body-sm ${isToday ? 'text-secondary font-bold' : 'text-on-surface'}`}>{h.label}</span>
                <span className={`font-label-md text-label-md ${isToday ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>{h.time}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-space-sm">
          <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="px-space-md py-space-xs rounded-full bg-surface-container text-on-surface font-label-md hover:bg-secondary hover:text-on-secondary transition-colors">Instagram</a>
          <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="px-space-md py-space-xs rounded-full bg-surface-container text-on-surface font-label-md hover:bg-secondary hover:text-on-secondary transition-colors">Facebook</a>
        </div>
        
        <div className="pt-space-md flex flex-col gap-space-xs text-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">© {currentYear} {siteConfig.name}. Handcrafted with love.</span>
        </div>
      </div>
    </footer>
  );
}
