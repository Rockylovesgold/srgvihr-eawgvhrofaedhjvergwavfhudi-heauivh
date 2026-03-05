"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Layers, Smartphone, Globe } from "lucide-react";
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/motion";

const WIREFRAME_BLOCKS = [
  { w: "100%", h: "12px", radius: "6px" },
  { w: "70%", h: "8px", radius: "4px" },
  { w: "100%", h: "60px", radius: "8px", accent: true },
  { w: "48%", h: "40px", radius: "6px", inline: true },
  { w: "48%", h: "40px", radius: "6px", inline: true },
  { w: "100%", h: "10px", radius: "5px" },
  { w: "85%", h: "8px", radius: "4px" },
  { w: "100%", h: "36px", radius: "6px", cta: true },
];

function AppWireframe() {
  return (
    <motion.div
      variants={slideInRight}
      className="relative glass-card p-6 lg:p-8 animate-float"
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-pulse/20 via-transparent to-metallic/10 pointer-events-none" />

      <div className="relative space-y-4">
        {/* Title bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          <span className="ml-3 data-label text-zinc-500">custom-app.rockmount.ai</span>
        </div>

        {/* Wireframe blocks */}
        {WIREFRAME_BLOCKS.map((block, i) => {
          if (block.inline) {
            const next = WIREFRAME_BLOCKS[i + 1];
            if (i % 2 !== 0 || !next?.inline) return null;
            return (
              <div key={i} className="flex gap-3">
                <div
                  className="rounded-md bg-white/[0.04] border border-white/[0.06]"
                  style={{
                    width: block.w,
                    height: block.h,
                    borderRadius: block.radius,
                  }}
                />
                <div
                  className="rounded-md bg-white/[0.04] border border-white/[0.06]"
                  style={{
                    width: next.w,
                    height: next.h,
                    borderRadius: next.radius,
                  }}
                />
              </div>
            );
          }
          if (block.inline) return null;

          return (
            <div
              key={i}
              className={`${
                block.accent
                  ? "bg-pulse/8 border border-pulse/15"
                  : block.cta
                    ? "bg-pulse/15 border border-pulse/25"
                    : "bg-white/[0.03] border border-white/[0.05]"
              }`}
              style={{
                width: block.w,
                height: block.h,
                borderRadius: block.radius,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

const CAPABILITIES = [
  { icon: Code2, label: "Custom AI Tools" },
  { icon: Layers, label: "Internal Systems" },
  { icon: Smartphone, label: "Mobile-First" },
  { icon: Globe, label: "Web Platforms" },
];

export default function BespokeSystems() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-28 lg:py-36">
      <div ref={ref} className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Text side */}
          <motion.div variants={slideInLeft}>
            <span className="data-label text-pulse mb-4 block">
              BESPOKE ARCHITECTURE
            </span>
            <h2 className="text-display font-heading font-bold text-metallic mb-6">
              Custom Architecture &amp; Cutting-Edge Web Design
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              We build bespoke AI tools, internal systems, and responsive web
              platforms designed specifically around your business logic — not
              generic templates.
            </p>

            {/* Capability tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.label}
                  className="inline-flex items-center gap-2 glass-card px-4 py-2"
                >
                  <cap.icon size={14} className="text-metallic/60" />
                  <span className="text-sm text-zinc-400">{cap.label}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pulse/10 flex items-center justify-center">
                  <Code2 size={18} className="text-pulse" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    100% Custom Codebase
                  </div>
                  <div className="text-xs text-zinc-500">
                    No templates. No drag-and-drop. Every line purpose-built.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Wireframe side */}
          <AppWireframe />
        </motion.div>
      </div>
    </section>
  );
}
