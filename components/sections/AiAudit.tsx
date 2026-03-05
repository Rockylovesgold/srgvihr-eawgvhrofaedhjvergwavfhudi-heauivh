"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Search, TrendingUp, DollarSign, Clock } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

function EfficiencyGauge({ inView }: { inView: boolean }) {
  const score = useSpring(0, { stiffness: 40, damping: 25 });
  const rotation = useTransform(score, [0, 100], [-135, 135]);
  const displayScore = useTransform(score, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => score.set(96), 600);
      return () => clearTimeout(timeout);
    }
  }, [inView, score]);

  const R = 85;
  const CX = 110;
  const CY = 110;

  function polarToXY(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  }

  const segments = [
    { from: -135, to: -67.5, color: "#EF4444", label: "D" },
    { from: -67.5, to: 0, color: "#FBBF24", label: "C" },
    { from: 0, to: 67.5, color: "#34D399", label: "B" },
    { from: 67.5, to: 135, color: "#806EFF", label: "A+" },
  ];

  return (
    <div className="relative w-[220px] h-[180px] mx-auto">
      <svg viewBox="0 0 220 170" className="w-full h-full">
        {/* Track segments */}
        {segments.map((seg, i) => {
          const start = polarToXY(seg.from);
          const end = polarToXY(seg.to);
          return (
            <path
              key={i}
              d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
              fill="none"
              stroke={seg.color}
              strokeWidth="6"
              strokeLinecap="round"
              opacity={0.2}
            />
          );
        })}

        {/* Active track */}
        <motion.path
          d={`M ${polarToXY(-135).x} ${polarToXY(-135).y} A ${R} ${R} 0 1 1 ${polarToXY(135).x} ${polarToXY(135).y}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 0.96 } : {}}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        />

        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="33%" stopColor="#FBBF24" />
            <stop offset="66%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#806EFF" />
          </linearGradient>
        </defs>

        {/* Center dot */}
        <circle cx={CX} cy={CY} r="4" fill="#806EFF" />
      </svg>

      {/* Needle */}
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
            width: "65px",
            height: "2px",
            background: "linear-gradient(90deg, #806EFF, transparent)",
            top: "-1px",
            left: "0",
            borderRadius: "1px",
          }}
        />
      </motion.div>

      {/* Score label */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <motion.span className="font-mono text-3xl font-bold text-pulse">
          A+
        </motion.span>
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest">
          AI EFFICIENCY SCORE
        </span>
      </div>
    </div>
  );
}

const AUDIT_STATS = [
  {
    icon: DollarSign,
    value: "30%",
    label: "Cost Savings",
    desc: "Hidden operational costs uncovered within 60 days",
  },
  {
    icon: Clock,
    value: "60",
    suffix: "days",
    label: "Time to Value",
    desc: "From audit to measurable ROI",
  },
  {
    icon: TrendingUp,
    value: "4.2x",
    label: "Avg. ROI",
    desc: "Return on automation investment in year one",
  },
];

export default function AiAudit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="audit" className="py-28 lg:py-36">
      <div ref={ref} className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <span className="data-label text-pulse mb-4 block">
              AI AUDIT & COST STRATEGY
            </span>
            <h2 className="text-display font-heading font-bold text-metallic mb-5">
              Strategic AI Audits
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              We process your workflows to pinpoint exactly where your company
              can save money, reclaim time, and automate.
            </p>
          </motion.div>

          {/* Gauge + Stats */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* Gauge card */}
            <motion.div variants={fadeUp} className="glass-card p-8 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-6 self-start">
                <Search size={14} className="text-pulse" />
                <span className="data-label">AI EFFICIENCY GAUGE</span>
              </div>
              <EfficiencyGauge inView={inView} />
              <p className="mt-6 text-sm text-zinc-500 text-center max-w-xs">
                Animated live from your audit data — see exactly where your
                organization stands.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              {AUDIT_STATS.map((stat) => (
                <div key={stat.label} className="glass-card-hover p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-pulse/10 flex items-center justify-center shrink-0">
                    <stat.icon size={18} className="text-pulse" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-mono text-2xl font-bold text-white">
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-sm text-zinc-500">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-zinc-300 mb-1">
                      {stat.label}
                    </div>
                    <p className="text-xs text-zinc-500">{stat.desc}</p>
                  </div>
                </div>
              ))}

              <div className="glass-card p-4 text-center">
                <span className="text-sm text-zinc-400">
                  Uncover an average of{" "}
                  <span className="text-white font-bold">30%</span> in hidden
                  operational cost savings within the first{" "}
                  <span className="text-white font-bold">60 days</span>.
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
