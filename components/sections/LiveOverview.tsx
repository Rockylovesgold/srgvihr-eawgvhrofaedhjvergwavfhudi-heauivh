"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, Wifi, Zap } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

const NODES = [
  { id: 1, x: 15, y: 25, label: "CRM", delay: 0 },
  { id: 2, x: 45, y: 15, label: "ERP", delay: 0.3 },
  { id: 3, x: 75, y: 30, label: "API", delay: 0.6 },
  { id: 4, x: 30, y: 60, label: "ML", delay: 0.2 },
  { id: 5, x: 60, y: 55, label: "DATA", delay: 0.5 },
  { id: 6, x: 85, y: 65, label: "IOT", delay: 0.8 },
  { id: 7, x: 50, y: 40, label: "CORE", delay: 0.1, isCore: true },
];

const CONNECTIONS = [
  [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
  [1, 4], [2, 5], [3, 6], [4, 5], [5, 6],
];

function NetworkGraph() {
  return (
    <div className="relative w-full aspect-[16/10] glass-card p-6 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
          <span className="data-label">NETWORK STATUS — LIVE</span>
        </div>
        <span className="data-label text-emerald-400">ALL NODES HEALTHY</span>
      </div>

      {/* Graph area */}
      <div className="relative w-full h-[calc(100%-2rem)]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80">
          {CONNECTIONS.map(([from, to], i) => {
            const a = NODES.find((n) => n.id === from)!;
            const b = NODES.find((n) => n.id === to)!;
            return (
              <motion.line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(192, 255, 255, 0.08)"
                strokeWidth="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.08 }}
              />
            );
          })}
        </svg>

        {NODES.map((node) => (
          <motion.div
            key={node.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: node.delay + 0.8,
            }}
          >
            {/* Pulse ring */}
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full ${
                  node.isCore ? "bg-pulse" : "bg-metallic/60"
                }`}
              />
              <div
                className={`absolute inset-0 rounded-full animate-node-pulse ${
                  node.isCore
                    ? "bg-pulse/40"
                    : "bg-metallic/20"
                }`}
              />
            </div>
            <span className="mt-1 font-mono text-[8px] text-zinc-500 tracking-wider">
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    desc: "Track every node, process, and data flow across your entire business network.",
  },
  {
    icon: Wifi,
    title: "Live Data Streams",
    desc: "Continuous data ingestion from CRM, ERP, APIs, and IoT endpoints.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    desc: "Actionable intelligence delivered before issues impact operations.",
  },
];

export default function LiveOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="platform" className="py-28 lg:py-36">
      <div ref={ref} className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <span className="data-label text-pulse mb-4 block">
              LIVE COMPANY OVERVIEW
            </span>
            <h2 className="text-display font-heading font-bold text-metallic mb-5">
              Total Operational Visibility
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Instantly check, monitor, and track everything inside your
              business network in real-time.
            </p>
          </motion.div>

          {/* Network graph + metric */}
          <motion.div variants={fadeUp} className="max-w-3xl mx-auto mb-16">
            <NetworkGraph />
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 glass-card px-6 py-3">
                <Zap size={16} className="text-pulse" />
                <span className="font-mono text-sm text-zinc-400">
                  Average{" "}
                  <span className="text-white font-bold">40% reduction</span>{" "}
                  in reporting time
                </span>
              </div>
            </div>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-4"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="glass-card-hover p-6"
              >
                <f.icon size={20} className="text-pulse mb-4" />
                <h3 className="font-heading font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
