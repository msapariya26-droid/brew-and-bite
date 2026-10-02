import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'motion/react';

export default function CountUp({ end, duration = 0.9 }) {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  useEffect(() => {
    if (isInView && typeof end === 'number') {
      animate(count, end, { duration, ease: "easeOut" });
    }
  }, [isInView, end, count, duration]);

  if (typeof end !== 'number') {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration }}
      >
        {end}
      </motion.span>
    );
  }

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
