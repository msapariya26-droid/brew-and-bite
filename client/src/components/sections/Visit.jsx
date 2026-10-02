import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../../config/site';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useOpenNow } from '../../hooks/useOpenNow';

export default function Visit() {
  const { isOpen } = useOpenNow();

  return (
    <section id="visit" className="flex flex-col px-margin-mobile py-space-md gap-space-md max-w-2xl lg:max-w-4xl mx-auto w-full xl:max-w-7xl xl:mx-auto">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-surface-container">
        {/* NO MAP - explicit requirement */}
        <div className="p-space-md bg-surface-container-lowest flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <motion.span 
                animate={isOpen ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={isOpen ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
                className={`inline-block w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-primary' : 'bg-error'}`}
              ></motion.span>
              <span className="font-label-md text-label-md text-on-surface font-bold">
                {isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">Walk-ins Welcome</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-1.5 lg:gap-space-md pt-1">
            <div className="flex flex-col gap-1.5 lg:w-1/2">
              <div className="flex items-start gap-2">
                <MapPin size={20} className="text-secondary mt-0.5" />
                <span className="font-body-sm text-body-sm text-on-surface">{siteConfig.address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-secondary" />
                <a href={`tel:${siteConfig.phoneRaw}`} className="font-body-sm text-body-sm text-secondary font-medium hover:underline">
                  {siteConfig.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-secondary" />
                <a href={`mailto:${siteConfig.email}`} className="font-body-sm text-body-sm text-secondary font-medium hover:underline">
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 lg:w-1/2 lg:pl-space-md lg:border-l lg:border-outline-variant mt-2 lg:mt-0 pt-2 lg:pt-0 border-t border-outline-variant lg:border-t-0">
              <div className="flex items-start gap-2">
                <Clock size={20} className="text-secondary mt-0.5" />
                <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Daily Roasting: 7:00 AM - 3:00 PM<br/>
                  Wood Oven: 11:30 AM - 9:00 PM
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
