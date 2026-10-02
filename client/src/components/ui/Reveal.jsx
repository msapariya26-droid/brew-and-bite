import React from 'react';
import { motion } from 'motion/react';

export default function Reveal({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 0.8, 0.24, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
