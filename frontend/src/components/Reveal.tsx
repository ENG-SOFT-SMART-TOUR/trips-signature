import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: 'div' | 'section' | 'figure' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
};

/**
 * Apple-style scroll reveal: subtle blur-to-clear + soft lift.
 * Uses a slow ease-out curve (cubic-bezier 0.22, 1, 0.36, 1) for premium feel.
 * Honors prefers-reduced-motion automatically.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 32,
  blur = 8,
  duration = 0.9,
  className,
  once = true,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-80px 0px -80px 0px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
