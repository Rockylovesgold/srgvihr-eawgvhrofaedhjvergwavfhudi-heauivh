import type { Transition, Variants } from "framer-motion";

export const HEAVY: Transition = { type: "spring", stiffness: 100, damping: 30 };
export const HEAVY_SLOW: Transition = { type: "spring", stiffness: 60, damping: 25 };
export const SNAP: Transition = { type: "spring", stiffness: 300, damping: 30 };
export const FADE: Transition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: HEAVY },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: FADE },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: HEAVY },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: HEAVY },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: HEAVY },
};
