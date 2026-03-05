"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Bot, GitBranch, Repeat, CheckCircle2 } from "lucide-react";
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/motion";

const PIPELINE_STEPS = [
  {
    icon: GitBranch,
    label: "INTAKE",
    title: "Data Ingestion",
    desc: "Raw inputs from CRM, email, and APIs flow into the classification engine.",
    status: "active",
  },
  {
    icon: Bot,
    label: "PROCESS",
    title: "Agent Assignment",
    desc: "Intelligent agents are auto-deployed based on task type, urgency, and context.",
    status: "active",
  },
  {
    icon: Repeat,
    label: "AUTOMATE",
    title: "Task Execution",
    desc: "Multi-step workflows execute autonomously with human-in-the-loop safeguards.",
    status: "active",
  },
  {
    icon: CheckCircle2,
    label: "DELIVER",
    title: "Output & Learning",
    desc: "Results are delivered, logged, and fed back to improve future agent performance.",
    status: "complete",
  },
];

export default function AgentsEvidence() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="agents" className="py-28 lg:py-36">
      <div ref={ref} className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <span className="data-label text-pulse mb-4 block">
              PROCESS AUTOMATION
            </span>
            <h2 className="text-display font-heading font-bold text-metallic mb-5">
              Autonomous Task Execution
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Deploy intelligent agents to speed up processing times and
              automate repetitive tasks across your entire operation.
            </p>
          </motion.div>

          {/* Pipeline timeline */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-pulse/40 via-metallic/20 to-transparent lg:-translate-x-px" />

              <div className="space-y-8 lg:space-y-12">
                {PIPELINE_STEPS.map((step, i) => (
                  <motion.div
                    key={step.label}
                    variants={i % 2 === 0 ? slideInLeft : slideInRight}
                    className={`relative flex items-start gap-6 lg:gap-12 ${
                      i % 2 === 0
                        ? "lg:flex-row"
                        : "lg:flex-row-reverse lg:text-right"
                    }`}
                  >
                    {/* Content */}
                    <div className="flex-1 glass-card-hover p-6 ml-16 lg:ml-0">
                      <span className="data-label text-pulse mb-2 block">
                        {step.label}
                      </span>
                      <h3 className="font-heading font-semibold text-lg text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Node */}
                    <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 z-10 flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === "complete"
                            ? "bg-emerald-500/20 border border-emerald-500/40"
                            : "bg-pulse/15 border border-pulse/30"
                        }`}
                      >
                        <step.icon
                          size={14}
                          className={
                            step.status === "complete"
                              ? "text-emerald-400"
                              : "text-pulse"
                          }
                        />
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden lg:block flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <motion.div variants={fadeUp} className="max-w-2xl mx-auto">
            <div className="glass-card p-6 lg:p-8 text-center">
              <div className="grid grid-cols-2 gap-8 divide-x divide-white/5">
                <div>
                  <div className="font-mono text-2xl lg:text-3xl font-bold text-white mb-1">
                    65%
                  </div>
                  <span className="data-label">Efficiency Gain</span>
                </div>
                <div>
                  <div className="font-mono text-2xl lg:text-3xl font-bold text-pulse mb-1">
                    24/7
                  </div>
                  <span className="data-label">Task Continuity</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
