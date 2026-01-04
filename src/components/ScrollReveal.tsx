import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
}

export const ScrollReveal = ({ 
  children, 
  className = "",
  delay = 0, 
  direction = "up",
  duration = 0.6,
  once = true 
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: "-100px 0px -100px 0px" 
  });

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        y: directions[direction].y,
        x: directions[direction].x
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        x: 0
      } : {}}
      transition={{ 
        duration, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const StaggerReveal = ({ 
  children, 
  className = "",
  staggerDelay = 0.1,
  direction = "up"
}: StaggerRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-50px 0px -50px 0px" 
  });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ 
            opacity: 0, 
            y: directions[direction].y,
            x: directions[direction].x
          }}
          animate={isInView ? { 
            opacity: 1, 
            y: 0,
            x: 0
          } : {}}
          transition={{ 
            duration: 0.5, 
            delay: index * staggerDelay,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};
