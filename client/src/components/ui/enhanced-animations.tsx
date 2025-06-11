import React from 'react';
import { motion } from 'framer-motion';

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const slideIn = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const glowAnimation = {
  initial: { boxShadow: "0 0 0px rgba(168, 85, 247, 0)" },
  animate: {
    boxShadow: [
      "0 0 0px rgba(168, 85, 247, 0)",
      "0 0 20px rgba(168, 85, 247, 0.3)",
      "0 0 0px rgba(168, 85, 247, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Enhanced wrapper components
export const FadeInSection = ({ children, delay = 0, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleInCard = ({ children, delay = 0, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInFromLeft = ({ children, delay = 0, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInFromRight = ({ children, delay = 0, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggeredList = ({ children, ...props }: any) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    {...props}
  >
    {React.Children.map(children, (child, index) => (
      <motion.div
        key={index}
        variants={fadeIn}
      >
        {child}
      </motion.div>
    ))}
  </motion.div>
);

export const FloatingElement = ({ children, ...props }: any) => (
  <motion.div
    variants={floatingAnimation}
    initial="initial"
    animate="animate"
    {...props}
  >
    {children}
  </motion.div>
);

export const PulsingElement = ({ children, ...props }: any) => (
  <motion.div
    variants={pulseAnimation}
    initial="initial"
    animate="animate"
    {...props}
  >
    {children}
  </motion.div>
);

export const GlowingCard = ({ children, ...props }: any) => (
  <motion.div
    variants={glowAnimation}
    initial="initial"
    animate="animate"
    whileHover={{
      boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
      transition: { duration: 0.3 }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
  transition: { duration: 0.4, ease: "easeInOut" }
};

export const slidePageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};