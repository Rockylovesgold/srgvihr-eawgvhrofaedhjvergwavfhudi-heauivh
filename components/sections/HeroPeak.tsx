"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { fadeUp, staggerContainer, fadeIn } from "@/lib/motion";

const MountainPeak = dynamic(
  () => import("@/components/three/MountainPeak"),
  { ssr: false },
);

const CRAWL_LINES = [
  "SYSTEM_INITIALIZE...",
  "LOADING CORE MODULES...",
  "ESTABLISHING SECURE CHANNELS...",
  "STATUS: OPERATIONAL",
  "SUCCESS",
];

function TerminalCrawl({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < CRAWL_LINES.length) {
        setLines((prev) => [...prev, CRAWL_LINES[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          onComplete();
        }, 200);
      }
    }, 90);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-surface flex items-center justify-center"
      animate={done ? { opacity: 0, pointerEvents: "none" as const } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="font-mono text-sm max-w-md w-full px-8" style={{ color: "rgba(192,255,255,0.6)" }}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.12 }}
            className={`mb-1 ${line === "SUCCESS" ? "font-bold mt-2" : ""}`}
            style={{ color: line === "SUCCESS" ? "#34D399" : undefined }}
          >
            <span style={{ color: "rgba(255,255,255,0.2)" }} className="mr-2">&gt;</span>
            {line}
          </motion.div>
        ))}
        <span
          className="inline-block w-2 h-4 animate-terminal-blink ml-1"
          style={{ backgroundColor: "rgba(192,255,255,0.5)" }}
        />
      </div>
    </motion.div>
  );
}

const CLAIM_CARDS = [
  {
    metric: "94%",
    label: "Straight-through processing",
    desc: "Fully autonomous task completion without human intervention.",
  },
  {
    metric: "£2.3M",
    label: "Average cost savings",
    desc: "Annual operational savings across enterprise deployments.",
  },
  {
    metric: "500+",
    label: "Staff serviced",
    desc: "Personnel supported by RockMount autonomous agents.",
  },
];

export default function HeroPeak() {
  const [showContent, setShowContent] = useState(false);
  const handleComplete = useCallback(() => setShowContent(true), []);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  const card1Opacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [0.35, 0.45], [50, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);
  const card3Opacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const card3Y = useTransform(scrollYProgress, [0.65, 0.75], [50, 0]);

  const cardTransforms = [
    { opacity: card1Opacity, y: card1Y },
    { opacity: card2Opacity, y: card2Y },
    { opacity: card3Opacity, y: card3Y },
  ];

  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "400vh" }}>
      <TerminalCrawl onComplete={handleComplete} />

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Mountain */}
        <div className="absolute inset-0 z-0">
          {showContent && <MountainPeak />}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.3) 40%, transparent 100%)" }} />
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)" }} />

        {/* PHASE 1: The Hook */}
        {showContent && (
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="absolute inset-0 z-10 flex items-center"
          >
            <div className="section-container">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-3xl"
              >
                {/* Logo */}
                <motion.div variants={fadeIn} className="mb-6">
                  <Image
                    src="/images/logo-transparent.png"
                    alt="RockMount AI"
                    width={220}
                    height={66}
                    className="h-16 w-auto"
                    priority
                  />
                </motion.div>

                {/* Domain tag */}
                <motion.div variants={fadeIn} className="mb-8">
                  <span className="font-mono text-label-sm uppercase tracking-[0.2em]" style={{ color: "rgba(192,255,255,0.4)" }}>
                    ROCKMOUNTAI.COM
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={fadeUp}
                  className="text-display-xl font-heading font-bold text-metallic-gradient leading-[1.05] mb-8"
                >
                  Heading to a frictionless
                  <br />
                  enterprise.
                </motion.h1>

                {/* Sub-narrative */}
                <motion.p
                  variants={fadeUp}
                  className="text-lg lg:text-xl max-w-xl mb-4 leading-relaxed"
                  style={{ color: "#A1A1AA" }}
                >
                  We architect AI systems that act, think, and scale.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Scroll cue */}
        {showContent && (
          <motion.div
            style={{ opacity: scrollCueOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <span className="font-mono uppercase" style={{ fontSize: "10px", color: "#52525B", letterSpacing: "0.25em" }}>
              Scroll to know more
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={16} style={{ color: "#52525B" }} />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 3: B2B Claim Cards */}
        {showContent && (
          <div className="absolute inset-0 z-10 flex items-end pb-20 pointer-events-none">
            <div className="section-container">
              <div className="grid lg:grid-cols-3 gap-4">
                {CLAIM_CARDS.map((card, i) => (
                  <motion.div
                    key={card.label}
                    style={{ opacity: cardTransforms[i].opacity, y: cardTransforms[i].y }}
                    className="glass-card p-6 pointer-events-auto"
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
        )}
      </div>
    </div>
  );
}
