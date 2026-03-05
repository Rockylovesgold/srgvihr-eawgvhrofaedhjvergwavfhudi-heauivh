"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface SeoHealthGaugeProps {
  score: number; // 0-100
}

function getGradeInfo(score: number) {
  if (score >= 90) return { grade: "A+", color: "#806EFF" };
  if (score >= 80) return { grade: "A", color: "#34D399" };
  if (score >= 70) return { grade: "B+", color: "#34D399" };
  if (score >= 60) return { grade: "B", color: "#FBBF24" };
  if (score >= 40) return { grade: "C", color: "#FBBF24" };
  return { grade: "D", color: "#EF4444" };
}

export default function SeoHealthGauge({ score }: SeoHealthGaugeProps) {
  const springScore = useSpring(0, { stiffness: 100, damping: 30 });
  const rotation = useTransform(springScore, [0, 100], [-135, 135]);
  const displayScore = useTransform(springScore, (v) => Math.round(v));

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  const { grade, color } = getGradeInfo(score);

  const R = 90;
  const CX = 120;
  const CY = 120;
  const startAngle = -225;
  const endAngle = 45;
  const totalAngle = endAngle - startAngle;

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: CX + R * Math.cos(rad),
      y: CY + R * Math.sin(rad),
    };
  }

  const arcStart = polarToCartesian(startAngle);
  const arcEnd = polarToCartesian(endAngle);

  const arcPath = `M ${arcStart.x} ${arcStart.y} A ${R} ${R} 0 1 1 ${arcEnd.x} ${arcEnd.y}`;

  return (
    <div className="relative w-[240px] h-[200px] mx-auto">
      <svg viewBox="0 0 240 200" className="w-full h-full">
        {/* Track */}
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Colored segments */}
        {[
          { from: 0, to: 0.3, color: "#EF4444" },
          { from: 0.3, to: 0.6, color: "#FBBF24" },
          { from: 0.6, to: 0.8, color: "#34D399" },
          { from: 0.8, to: 1, color: "#806EFF" },
        ].map((seg, i) => {
          const segStartAngle = startAngle + totalAngle * seg.from;
          const segEndAngle = startAngle + totalAngle * seg.to;
          const s = polarToCartesian(segStartAngle);
          const e = polarToCartesian(segEndAngle);
          const largeArc = segEndAngle - segStartAngle > 180 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${s.x} ${s.y} A ${R} ${R} 0 ${largeArc} 1 ${e.x} ${e.y}`}
              fill="none"
              stroke={seg.color}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={0.3}
            />
          );
        })}

        {/* Needle pivot */}
        <circle cx={CX} cy={CY} r="6" fill={color} opacity={0.6} />
        <circle cx={CX} cy={CY} r="3" fill={color} />
      </svg>

      {/* Needle — rendered with framer-motion for spring physics */}
      <motion.div
        className="absolute"
        style={{
          left: CX,
          top: CY,
          width: 0,
          height: 0,
          rotate: rotation,
          transformOrigin: "0 0",
        }}
      >
        <div
          className="absolute"
          style={{
            width: "70px",
            height: "2px",
            background: `linear-gradient(90deg, ${color}, transparent)`,
            top: "-1px",
            left: "0",
            borderRadius: "1px",
          }}
        />
      </motion.div>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
        <motion.span
          className="font-mono text-3xl font-bold"
          style={{ color }}
        >
          {grade}
        </motion.span>
        <motion.span className="font-mono text-sm text-white/40">
          SEO HEALTH
        </motion.span>
      </div>
    </div>
  );
}
