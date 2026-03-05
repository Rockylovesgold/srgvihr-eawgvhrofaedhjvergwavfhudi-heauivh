"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect, type MouseEvent } from "react";
import { CheckCircle2, Phone, Bot, Activity } from "lucide-react";
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/motion";

/* ═══════════════════════════════════════════════
   SHARED UTILITIES
   ═══════════════════════════════════════════════ */

function TiltCard({ children, className = "", strength = 4 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  function handleMove(e: MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * strength);
    rotateX.set(((cy - e.clientY) / (rect.height / 2)) * strength);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MetricPair({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {metrics.map((m) => (
        <div key={m.label} className="metric-badge">
          <CheckCircle2 size={12} style={{ color: "#806EFF" }} />
          <span className="metric-value">{m.value}</span>
          <span className="metric-label">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

function AnimCounter({ target, suffix = "%" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 25 });
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) mv.set(target);
  }, [inView, mv, target]);

  return <motion.span ref={ref} className="font-mono text-2xl font-bold text-white">{display}</motion.span>;
}

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 22 },
  },
};

/* ═══════════════════════════════════════════════
   MODULE 1: THE COMMAND CENTER
   ═══════════════════════════════════════════════ */

function CommandCenterGraphic() {
  return (
    <TiltCard className="glass-card p-8">
      <div className="flex items-center gap-2 mb-6">
        <motion.div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: "#806EFF", boxShadow: "0 0 8px rgba(128,110,255,0.6)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="data-label">OPERATIONAL PULSE — LIVE</span>
      </div>

      {/* Metric counters */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { target: 15, label: "COST CUT" },
          { target: 30, label: "TIME SAVED" },
          { target: 20, label: "EFFICIENCY" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,255,255,0.08)" }}>
            <AnimCounter target={m.target} />
            <div className="font-mono text-[8px] mt-2 tracking-widest" style={{ color: "#52525B" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Central pulse */}
      <div className="flex justify-center py-4">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(128,110,255,0.25)" }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, type: "spring", stiffness: 40, damping: 15 }}
          />
          <motion.div
            className="absolute inset-3 rounded-full"
            style={{ border: "1px solid rgba(128,110,255,0.15)" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3, type: "spring", stiffness: 40, damping: 15 }}
          />
          <motion.div
            className="w-12 h-12 rounded-full"
            style={{
              backgroundColor: "rgba(128,110,255,0.12)",
              boxShadow: "0 0 40px rgba(128,110,255,0.35)",
              border: "1px solid rgba(128,110,255,0.3)",
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, type: "spring", stiffness: 60, damping: 20 }}
          />
        </div>
      </div>

      {/* Network mini graph */}
      <svg className="w-full mt-4" viewBox="0 0 200 60">
        {[[20,30,80,20],[80,20,140,40],[140,40,180,25],[20,30,60,50],[60,50,140,40],[80,20,60,50]].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(192,255,255,0.06)" strokeWidth="0.5" />
        ))}
        {[[20,30],[80,20],[140,40],[180,25],[60,50]].map(([cx,cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={i === 2 ? 4 : 2.5}
              fill={i === 2 ? "#806EFF" : "rgba(255,255,255,0.2)"} />
            {i === 2 && (
              <circle cx={cx} cy={cy} r="8" fill="none" stroke="rgba(128,110,255,0.25)"
                strokeWidth="0.5" className="animate-node-pulse" />
            )}
          </g>
        ))}
      </svg>
      <div className="mt-4 text-center">
        <span className="font-mono text-[9px] tracking-widest" style={{ color: "#52525B" }}>CRM · FINANCE · HR · PIPELINES</span>
      </div>
    </TiltCard>
  );
}

function Module1() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} variants={sectionReveal} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div variants={slideInLeft}>
          <span className="data-label mb-5 block" style={{ color: "#806EFF" }}>MODULE 01 — THE COMMAND CENTER</span>
          <h3 className="text-headline font-heading font-bold text-metallic-gradient mb-5">
            Total Operational Visibility &amp; Waste Reduction
          </h3>
          <MetricPair metrics={[
            { value: "15%–25%", label: "Cost Reduction" },
            { value: "30%–50%", label: "Mgmt Time Saved" },
          ]} />
          <p style={{ color: "#A1A1AA" }} className="leading-relaxed text-lg">
            A centralized AI dashboard connecting CRM, Finance, and HR. We audit your
            workflows to eliminate slow reporting and deploy real-time operational visibility.
          </p>
        </motion.div>
        <motion.div variants={slideInRight}>
          <CommandCenterGraphic />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MODULE 2: THE DIGITAL WORKFORCE
   ═══════════════════════════════════════════════ */

const AGENT_CARDS = [
  { name: "Lead Response", icon: "📨" },
  { name: "Finance", icon: "📊" },
  { name: "Operations", icon: "⚙️" },
];

const AGENT_TASKS = [
  { name: "CRM Data Entry", time: "0.04ms", status: "COMPLETE" },
  { name: "Invoice Processing", time: "0.11ms", status: "COMPLETE" },
  { name: "Lead Scoring", time: "0.08ms", status: "PROCESSING" },
  { name: "Shift Scheduling", time: "0.02ms", status: "COMPLETE" },
  { name: "Report Generation", time: "0.06ms", status: "COMPLETE" },
];

function Module2() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [fanned, setFanned] = useState(false);

  return (
    <motion.div ref={ref} variants={sectionReveal} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div variants={slideInRight} className="order-2 lg:order-1 space-y-3">
          {/* Fan-out agent deck */}
          <div
            className="relative h-28 mb-8 flex justify-center"
            onMouseEnter={() => setFanned(true)}
            onMouseLeave={() => setFanned(false)}
          >
            {AGENT_CARDS.map((card, i) => (
              <motion.div
                key={card.name}
                className="absolute glass-card px-6 py-4 flex items-center gap-3 cursor-pointer"
                style={{
                  zIndex: 3 - i,
                  border: "1px solid rgba(192,255,255,0.15)",
                }}
                animate={{
                  x: fanned ? (i - 1) * 160 : (i - 1) * 10,
                  rotate: fanned ? (i - 1) * -2 : (i - 1) * 4,
                  y: fanned ? 0 : i * 5,
                  boxShadow: fanned
                    ? "0 0 25px rgba(192,255,255,0.08)"
                    : "0 0 0px rgba(192,255,255,0)",
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <span className="text-xl">{card.icon}</span>
                <span className="font-mono text-sm text-white font-medium">{card.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Task list */}
          {AGENT_TASKS.map((task, i) => (
            <motion.div key={task.name} variants={fadeUp}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="glass-card-hover p-5 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Bot size={14} style={{ color: "#806EFF" }} />
                <span className="text-sm font-medium text-white">{task.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {hoveredIdx === i && (
                  <motion.span
                    initial={{ opacity: 0, x: 12, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="font-mono text-xs font-bold"
                    style={{ color: "#C0FFFF" }}
                  >
                    {task.time}
                  </motion.span>
                )}
                <motion.div
                  animate={hoveredIdx === i && task.status === "COMPLETE" ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: task.status === "PROCESSING" ? "#806EFF" : "#C0FFFF" }}>
                    {task.status}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={slideInLeft} className="order-1 lg:order-2">
          <span className="data-label mb-5 block" style={{ color: "#806EFF" }}>MODULE 02 — THE DIGITAL WORKFORCE</span>
          <h3 className="text-headline font-heading font-bold text-metallic-gradient mb-5">
            Autonomous Task Execution &amp; Infrastructure
          </h3>
          <MetricPair metrics={[
            { value: "30%–60%", label: "Labor Cost Reduction" },
            { value: "3x–10x", label: "Faster Execution" },
          ]} />
          <p style={{ color: "#A1A1AA" }} className="leading-relaxed text-lg">
            Deploy autonomous agents that perform tasks independently. We build integrated
            automation infrastructure to replace fragmented spreadsheets.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MODULE 3: UK PIPELINE
   ═══════════════════════════════════════════════ */

function PipelineGraphic() {
  const stages = [
    { label: "RAW CAPTURE", delay: 0.2 },
    { label: "AI SCORING", delay: 0.4 },
    { label: "INTENT MATCH", delay: 0.6 },
    { label: "QUALIFIED", delay: 0.8 },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {stages.map((s, i) => {
        const isLast = i === stages.length - 1;
        const width = `${100 - i * 18}%`;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scaleX: 0.7, boxShadow: "0 0 0px rgba(128,110,255,0)" }}
            whileInView={{
              opacity: 1,
              scaleX: 1,
              boxShadow: isLast
                ? "0 0 25px rgba(128,110,255,0.4)"
                : `0 0 ${8 + i * 4}px rgba(128,110,255,${0.08 + i * 0.06})`,
            }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: s.delay }}
            className="rounded-xl px-5 py-4 text-center"
            style={{
              width,
              background: isLast ? "rgba(128,110,255,0.1)" : `rgba(255,255,255,${0.02 + i * 0.015})`,
              border: `1px solid rgba(128,110,255,${0.06 + i * 0.08})`,
            }}
          >
            <span className="font-mono text-[9px] tracking-widest"
              style={{ color: isLast ? "#C0FFFF" : "#52525B" }}>{s.label}</span>
          </motion.div>
        );
      })}

      {/* Qualified lead card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 1.0 }}
        className="glass-card p-6 mt-3 w-[60%] text-center relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ border: "1px solid rgba(128,110,255,0.3)" }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <Phone size={16} style={{ color: "#806EFF" }} className="mx-auto mb-3 relative z-10" />
        <span className="font-mono text-sm text-white block relative z-10">Qualified Lead</span>
        <span className="font-mono text-base block mt-2 relative z-10" style={{ color: "#C0FFFF" }}>
          +44 7700 900077
        </span>
        <div className="mt-3 inline-block rounded-full px-4 py-1.5 relative z-10"
          style={{ background: "rgba(128,110,255,0.12)", border: "1px solid rgba(128,110,255,0.25)" }}>
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#806EFF" }}>
            Meeting Booked
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function Module3() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} variants={sectionReveal} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div variants={slideInLeft}>
          <span className="data-label mb-5 block" style={{ color: "#806EFF" }}>MODULE 03 — UK PIPELINE</span>
          <h3 className="text-headline font-heading font-bold text-metallic-gradient mb-5">
            Intelligent UK Lead Triage
          </h3>
          <MetricPair metrics={[
            { value: "35%–80%", label: "Conversion Increase" },
            { value: "Min → Sec", label: "Response Time" },
          ]} />
          <p style={{ color: "#A1A1AA" }} className="leading-relaxed text-lg">
            AI instantly captures, scores, and follows up with leads via email and SMS,
            booking meetings directly into your calendar.
          </p>
        </motion.div>
        <motion.div variants={slideInRight}>
          <PipelineGraphic />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MODULE 4: THE FORGE
   ═══════════════════════════════════════════════ */

function ForgeGraphic() {
  return (
    <TiltCard strength={6}>
      <div className="relative h-[320px] lg:h-[400px]" style={{ perspective: "1000px" }}>
        {/* Code editor */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
          className="absolute top-0 left-0 w-[64%] glass-card p-5"
          style={{ zIndex: 3, transform: "translateZ(30px)" }}
        >
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#52525B" }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#71717A" }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#A1A1AA" }} />
            <span className="ml-3 font-mono text-[8px]" style={{ color: "#52525B" }}>agent.py</span>
          </div>
          <div className="font-mono text-[11px] space-y-1.5" style={{ color: "#A1A1AA" }}>
            <div><span style={{ color: "#C0FFFF" }}>class</span> CustomAgent:</div>
            <div className="pl-4"><span style={{ color: "#C0FFFF" }}>def</span> process(self, data):</div>
            <div className="pl-8"><span style={{ color: "#806EFF" }}>return</span> self.model.execute(</div>
            <div className="pl-12">data=company_data,</div>
            <div className="pl-12">mode=<span style={{ color: "#C0FFFF" }}>&quot;bespoke&quot;</span></div>
            <div className="pl-8">)</div>
          </div>
        </motion.div>

        {/* Mobile wireframe */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 3 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
          className="absolute top-12 right-0 w-[38%] glass-card p-4"
          style={{ zIndex: 2, transform: "translateZ(15px)" }}
        >
          <div className="rounded-xl p-3 space-y-2.5" style={{ border: "1px solid rgba(192,255,255,0.08)" }}>
            <div className="w-full h-2.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
            <div className="w-[55%] h-2.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
            <div className="w-full h-10 rounded" style={{ backgroundColor: "rgba(128,110,255,0.07)", border: "1px solid rgba(128,110,255,0.12)" }} />
            <div className="flex gap-2">
              <div className="flex-1 h-8 rounded" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
              <div className="flex-1 h-8 rounded" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
            </div>
            <div className="w-full h-8 rounded" style={{ backgroundColor: "rgba(128,110,255,0.1)", border: "1px solid rgba(128,110,255,0.2)" }} />
          </div>
          <span className="font-mono text-[8px] block text-center mt-3" style={{ color: "#52525B" }}>mobile-app.tsx</span>
        </motion.div>

        {/* Dashboard mini */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
          className="absolute bottom-0 left-[6%] w-[75%] glass-card p-5"
          style={{ zIndex: 1, transform: "translateZ(0px)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={12} style={{ color: "#806EFF" }} />
            <span className="font-mono text-[9px]" style={{ color: "#52525B" }}>internal-tool.rockmount.ai</span>
          </div>
          <div className="flex gap-3">
            {[{ v: "1.8K", l: "TASKS" }, { v: "99.7%", l: "UPTIME" }, { v: "↑ 42%", l: "EFF." }].map(d => (
              <div key={d.l} className="flex-1 rounded-lg p-3 text-center"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(192,255,255,0.06)" }}>
                <div className="font-mono text-sm font-bold text-white">{d.v}</div>
                <div className="font-mono text-[7px] mt-1" style={{ color: "#52525B" }}>{d.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </TiltCard>
  );
}

function Module4() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} variants={sectionReveal} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div variants={slideInRight} className="order-2 lg:order-1">
          <ForgeGraphic />
        </motion.div>
        <motion.div variants={slideInLeft} className="order-1 lg:order-2">
          <span className="data-label mb-5 block" style={{ color: "#806EFF" }}>MODULE 04 — THE FORGE</span>
          <h3 className="text-headline font-heading font-bold text-metallic-gradient mb-5">
            Custom AI Tools Built Around Your Business
          </h3>
          <MetricPair metrics={[
            { value: "40%–70%", label: "Time Savings" },
            { value: "25%–40%", label: "Operational Efficiency" },
          ]} />
          <p style={{ color: "#A1A1AA" }} className="leading-relaxed text-lg">
            Custom mobile apps, client portals, and bespoke AI tools trained specifically
            on your company data and operational logic.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MODULE 5: THE STOREFRONT
   ═══════════════════════════════════════════════ */

function StorefrontGraphic() {
  return (
    <TiltCard className="glass-card overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(192,255,255,0.08)" }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#52525B" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#71717A" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#A1A1AA" }} />
        </div>
        <div className="flex-1 mx-5 rounded-lg py-1.5 px-4 text-center"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,255,255,0.06)" }}>
          <span className="font-mono text-[10px]" style={{ color: "#52525B" }}>rockmountai.com</span>
        </div>
      </div>

      {/* Viewport with gradient mesh */}
      <div className="p-7 relative overflow-hidden" style={{ minHeight: "240px" }}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 25% 40%, rgba(128,110,255,0.08) 0%, transparent 55%),
              radial-gradient(ellipse at 75% 60%, rgba(192,255,255,0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(128,110,255,0.06) 0%, transparent 45%)
            `,
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 space-y-5">
          <div className="rounded-xl p-5 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,255,255,0.06)", minHeight: "130px" }}>
            <div className="w-[70%] h-3.5 rounded mb-3" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
            <div className="w-[50%] h-2.5 rounded mb-5" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
            <div className="w-28 h-8 rounded-lg" style={{ backgroundColor: "rgba(128,110,255,0.15)", border: "1px solid rgba(128,110,255,0.25)" }} />
            <motion.div className="absolute bottom-0 left-0 h-[2px] w-full"
              style={{ background: "linear-gradient(90deg, transparent, #806EFF, transparent)" }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ v: "↑ 70%", l: "LEADS" }, { v: "3.2s", l: "LCP" }, { v: "98", l: "PERF" }].map(d => (
              <div key={d.l} className="rounded-lg p-3 text-center"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(192,255,255,0.05)" }}>
                <div className="font-mono text-sm font-bold text-white">{d.v}</div>
                <div className="font-mono text-[7px] mt-1" style={{ color: "#52525B" }}>{d.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function Module5() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} variants={sectionReveal} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div variants={slideInLeft}>
          <span className="data-label mb-5 block" style={{ color: "#806EFF" }}>MODULE 05 — THE STOREFRONT</span>
          <h3 className="text-headline font-heading font-bold text-metallic-gradient mb-5">
            High-Performance Conversion Architectures
          </h3>
          <MetricPair metrics={[
            { value: "20%–70%", label: "Conversion Increase" },
            { value: "30%–120%", label: "Lead Gen Increase" },
          ]} />
          <p style={{ color: "#A1A1AA" }} className="leading-relaxed text-lg">
            High-performance, WebGL-powered digital storefronts engineered to elevate
            brand perception and dominate enterprise SEO.
          </p>
        </motion.div>
        <motion.div variants={slideInRight}>
          <StorefrontGraphic />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MODULE 6: THE TERMINAL (CONTACT)
   ═══════════════════════════════════════════════ */

const headlineWords = "Ready to architect your frictionless enterprise?".split(" ");

const terminalWordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 22 },
  },
};

const terminalContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function ContactTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 120, damping: 18 });
  const springY = useSpring(my, { stiffness: 120, damping: 18 });
  const [hovered, setHovered] = useState(false);

  function handleMove(e: MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set((e.clientX - cx) * 0.06);
    my.set((e.clientY - cy) * 0.06);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 60, damping: 22 }}
      className="glass-card p-14 lg:p-20 text-center"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="data-label mb-8 block" style={{ color: "#806EFF" }}>THE TERMINAL</span>

      <motion.h3
        variants={terminalContainerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-display font-heading font-bold text-metallic-gradient mb-10"
      >
        {headlineWords.map((word, i) => (
          <motion.span key={i} variants={terminalWordVariants} className="inline-block mr-[0.3em]">
            {word}
          </motion.span>
        ))}
      </motion.h3>

      <motion.span
        style={{ x: springX, y: springY, display: "inline-block" }}
        onMouseEnter={() => setHovered(true)}
      >
        <motion.a
          href="mailto:info@rockmountai.com"
          className="inline-block font-heading font-bold transition-all duration-300"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: hovered ? "transparent" : "#FFFFFF",
            background: hovered ? "linear-gradient(135deg, #FFFFFF, #C0FFFF)" : "none",
            WebkitBackgroundClip: hovered ? "text" : "unset",
            backgroundClip: hovered ? "text" : "unset",
            WebkitTextFillColor: hovered ? "transparent" : "#FFFFFF",
            filter: hovered ? "drop-shadow(0 0 25px rgba(128,110,255,0.5))" : "none",
            letterSpacing: "-0.02em",
          }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          info@rockmountai.com
        </motion.a>
      </motion.span>

      <p className="mt-8 text-base" style={{ color: "#71717A" }}>
        Or schedule a call — we respond within 24 hours.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN SERVICES EXPORT
   ═══════════════════════════════════════════════ */

function Divider() {
  return (
    <div className="h-px w-full"
      style={{ background: "linear-gradient(90deg, transparent, rgba(192,255,255,0.08), transparent)" }} />
  );
}

export default function Services() {
  return (
    <section id="services" className="py-32 lg:py-40">
      <div className="section-container space-y-32 lg:space-y-48">
        <Module1 />
        <Divider />
        <Module2 />
        <Divider />
        <Module3 />
        <Divider />
        <Module4 />
        <Divider />
        <Module5 />
        <Divider />
        <ContactTerminal />
      </div>
    </section>
  );
}
