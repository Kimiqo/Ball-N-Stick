import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const BlurText = ({ text, delay = 0, className = '' }: BlurTextProps) => {
  const words = text.split(' ');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  
  return (
    <h2 ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        return (
          <motion.span
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
            animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
            transition={{
              delay: delay + i * 0.04,
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mr-1 md:mr-2 inline-block"
          >
            {word}
          </motion.span>
        );
      })}
    </h2>
  );
};
