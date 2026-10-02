import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Button from '../ui/Button';
import { Coffee, ArrowDown, Calendar, Star, Leaf, Flame } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.8, 0.24, 1] } }
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <section id="home" className="flex flex-col lg:flex-row lg:items-center px-margin-mobile pt-space-md pb-space-lg gap-space-md lg:gap-space-xl pt-24 lg:pt-32 xl:max-w-7xl xl:mx-auto w-full">
      
      {/* Left Column (Text & Buttons) */}
      <motion.div 
        className="flex flex-col gap-space-md lg:w-1/2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col gap-space-xs text-center lg:text-left items-center lg:items-start">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md shadow-sm">
            <Coffee size={15} className="text-secondary" />
            <span>Artisanal Roastery & Kitchen</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="font-headline-lg-mobile text-headline-lg-mobile lg:text-headline-lg xl:text-display-hero lg:font-headline-lg text-on-surface tracking-tight mt-1 max-w-sm lg:max-w-none mx-auto lg:mx-0">
            Good Food. Great Coffee. Good Times.
          </motion.h1>
          <motion.p variants={itemVariants} className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto lg:mx-0 leading-relaxed">
            Slow-crafted gourmet burgers on toasted brioche, authentic 72-hour fermented sourdough pizzas, and ethically sourced specialty coffee brewed to perfection.
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-space-sm w-full pt-1">
          <a href="#menu" className="w-full sm:flex-1 sm:max-w-[170px] inline-flex items-center justify-center gap-2 h-12 px-space-md rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:-translate-y-1 active:scale-95 transition-all">
            <span>Explore Menu</span>
            <ArrowDown size={18} />
          </a>
          <a href="#book" className="w-full sm:flex-1 sm:max-w-[170px] inline-flex items-center justify-center gap-1.5 h-12 px-space-md rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:-translate-y-1 active:scale-95 transition-all shadow-sm">
            <Calendar size={18} className="text-secondary" />
            <span>Reserve Table</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Right Column (Image & Badges) */}
      <div className="flex flex-col gap-space-xs lg:w-1/2">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(32,26,23,0.12)] bg-surface-container-low mt-space-xs lg:mt-0">
          <motion.div style={{ y }} className="w-full h-full lg:-my-[20%]">
            <motion.img 
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 0.8, 0.24, 1] }}
              src="/images/hero/hero.jpg" 
              alt="Hero" 
              className="w-full h-72 sm:h-84 lg:h-[140%] object-cover" 
              onError={(e) => { e.target.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23eae8e4'%3E%3Crect width='400' height='300'/%3E%3C/svg%3E"; }} 
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.3 }, 
              y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.3 }
            }}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-2xl bg-surface/90 backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <Star size={18} className="text-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight">4.9 Star Rating</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">1,200+ happy Pune locals</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-space-xs">
          {[
            { Icon: Leaf, label: 'Fresh Local Produce', delay: 0.4 },
            { Icon: Flame, label: 'Wood-Fired Oven', delay: 0.5 },
            { Icon: Coffee, label: 'Single-Origin Beans', delay: 0.6 }
          ].map(item => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              transition={{ 
                opacity: { duration: 0.6, delay: item.delay },
                y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: item.delay } 
              }}
              className="flex flex-col items-center text-center p-2.5 rounded-xl bg-surface-container-low shadow-sm"
            >
              <item.Icon size={22} className="text-secondary mb-1" />
              <span className="font-label-md text-label-md text-on-surface leading-tight">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
