"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

const MountainPeak = dynamic(
  () => import("@/components/three/MountainPeak"),
  { ssr: false },
);

const HEADLINE_WORDS = "Heading to a frictionless enterprise...".split(" ");
const SUBLINE_WORDS = "We architect AI systems that act, think, and scale.".split(" ");

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 80, damping: 22 },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.6 },
  },
};

const subContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.09 * HEADLINE_WORDS.length + 0.8 },
  },
};

function StaggeredHook({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const totalDelay = (0.09 * HEADLINE_WORDS.length + 0.07 * SUBLINE_WORDS.length + 1.2) * 1000;
    const timer = setTimeout(() => {
      setRevealed(true);
      onComplete();
    }, totalDelay);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
        className="mb-12 flex justify-center"
      >
        <span className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
          ROCKMOUNT AI
        </span>
      </motion.div>

      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-display-xl font-heading font-bold text-metallic-gradient leading-[1.05] mb-10"
      >
        {HEADLINE_WORDS.map((word, i) => (
          <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.3em]">
            {word}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        variants={subContainerVariants}
        initial="hidden"
        animate="visible"
        className="text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed"
        style={{ color: "#A1A1AA" }}
      >
        {SUBLINE_WORDS.map((word, i) => (
          <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
            {word}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}

const CLAIM_CARDS = [
  {
    metric: "94%",
    label: "Straight-through processing",
    desc: "Fully autonomous task completion without human intervention.",
  },
  {
    metric: "30–50%",
    label: "Average cost savings",
    desc: "Operational cost reduction across enterprise deployments.",
  },
];

export default function Hero3D() {
  const [hookDone, setHookDone] = useState(false);
  const lightPulse = useSpring(hookDone ? 1 : 0, { stiffness: 60, damping: 25 });
  const handleComplete = useCallback(() => setHookDone(true), []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -80]);

  const card1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [0.4, 0.5], [60, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [0.55, 0.65], [60, 0]);

  const cardTransforms = [
    { opacity: card1Opacity, y: card1Y },
    { opacity: card2Opacity, y: card2Y },
  ];

  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const canvasX = useSpring(pointerX, { stiffness: 30, damping: 25 });
  const canvasY = useSpring(pointerY, { stiffness: 30, damping: 25 });

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      pointerX.set((e.clientX - cx) * -0.02);
      pointerY.set((e.clientY - cy) * -0.02);
    }
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [pointerX, pointerY]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Mountain with pointer parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ x: canvasX, y: canvasY }}>
          <MountainPeak lightPulse={lightPulse} />
        </motion.div>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.4) 35%, transparent 100%)" }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)" }}
        />

        {/* Staggered narrative hook */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 z-10 flex items-center"
        >
          <div className="section-container py-32">
            <StaggeredHook onComplete={handleComplete} />
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span
            className="font-mono uppercase animate-pulse-glow"
            style={{ fontSize: "10px", color: "#806EFF", letterSpacing: "0.25em" }}
          >
            Scroll to initiate
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, type: "spring", stiffness: 80, damping: 18 }}
          >
            <ChevronDown size={18} style={{ color: "#806EFF" }} />
          </motion.div>
        </motion.div>

        {/* B2B Claim Cards */}
        <div className="absolute inset-0 z-10 flex items-end pb-24 pointer-events-none">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {CLAIM_CARDS.map((card, i) => (
                <motion.div
                  key={card.label}
                  style={{ opacity: cardTransforms[i].opacity, y: cardTransforms[i].y }}
                  className="glass-card p-7 pointer-events-auto"
                >
                  <div className="font-mono text-3xl lg:text-4xl font-bold text-white mb-2">
                    {card.metric}
                  </div>
                  <div className="text-sm font-semibold mb-1" style={{ color: "rgba(192,255,255,0.7)" }}>
                    {card.label}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#71717A" }}>
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
