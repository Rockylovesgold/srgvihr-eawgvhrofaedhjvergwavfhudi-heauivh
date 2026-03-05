"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Filter, UserCheck, MessageCircle, TrendingUp, ArrowDown } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

const FUNNEL_STAGES = [
  {
    icon: Filter,
    label: "RAW INBOUND",
    title: "All Traffic & Inquiries",
    width: "100%",
    color: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.1)",
    count: "1,000+",
  },
  {
    icon: MessageCircle,
    label: "AI ENGAGEMENT",
    title: "Automated Conversations",
    width: "75%",
    color: "rgba(128,110,255,0.06)",
    borderColor: "rgba(128,110,255,0.15)",
    count: "750",
  },
  {
    icon: UserCheck,
    label: "QUALIFIED",
    title: "Scored & Validated Leads",
    width: "45%",
    color: "rgba(128,110,255,0.12)",
    borderColor: "rgba(128,110,255,0.3)",
    count: "450",
    highlight: true,
  },
  {
    icon: TrendingUp,
    label: "CONVERTED",
    title: "Closed Opportunities",
    width: "25%",
    color: "rgba(52,211,153,0.1)",
    borderColor: "rgba(52,211,153,0.3)",
    count: "135",
    isGreen: true,
  },
];

function FunnelVisual() {
  return (
    <div className="flex flex-col items-center gap-3 max-w-lg mx-auto">
      {FUNNEL_STAGES.map((stage, i) => (
        <motion.div
          key={stage.label}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30,
            delay: 0.3 + i * 0.15,
          }}
          className="w-full flex flex-col items-center"
        >
          <div
            className="relative rounded-xl p-4 flex items-center gap-4 transition-all duration-300"
            style={{
              width: stage.width,
              background: stage.color,
              border: `1px solid ${stage.borderColor}`,
              boxShadow: stage.highlight
                ? "0 0 25px rgba(128,110,255,0.15)"
                : "none",
            }}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stage.isGreen
                  ? "bg-emerald-500/15"
                  : stage.highlight
                    ? "bg-pulse/15"
                    : "bg-white/5"
              }`}
            >
              <stage.icon
                size={16}
                className={
                  stage.isGreen
                    ? "text-emerald-400"
                    : stage.highlight
                      ? "text-pulse"
                      : "text-zinc-400"
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="data-label block text-[9px]">{stage.label}</span>
              <span className="text-sm text-white/80 block truncate">
                {stage.title}
              </span>
            </div>
            <span
              className={`font-mono text-lg font-bold ${
                stage.isGreen
                  ? "text-emerald-400"
                  : stage.highlight
                    ? "text-pulse"
                    : "text-white/50"
              }`}
            >
              {stage.count}
            </span>
          </div>

          {i < FUNNEL_STAGES.length - 1 && (
            <ArrowDown
              size={16}
              className="text-zinc-600 my-1"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function LeadFunnel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="insights" className="py-28 lg:py-36">
      <div ref={ref} className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <span className="data-label text-pulse mb-4 block">
              AUTO LEAD QUALIFICATION
            </span>
            <h2 className="text-display font-heading font-bold text-metallic mb-5">
              Intelligent Lead Triage
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Never miss a prospect. Our systems automatically qualify, score,
              and follow up with leads using natural, human-like AI interactions.
            </p>
          </motion.div>

          {/* Funnel */}
          <motion.div variants={fadeUp} className="mb-16">
            {inView && <FunnelVisual />}
          </motion.div>

          {/* Metric callout */}
          <motion.div variants={fadeUp} className="max-w-xl mx-auto">
            <div className="glass-card p-6 lg:p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <TrendingUp size={20} className="text-pulse" />
                <span className="font-mono text-3xl font-bold text-white">
                  3x
                </span>
              </div>
              <p className="text-zinc-400 text-sm">
                Boost lead conversion rates by up to{" "}
                <span className="text-white font-semibold">3x</span> with
                instant, 24/7 response protocols.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
