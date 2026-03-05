"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo, useCallback } from "react";
import { SectionReveal } from "@/components/layout/StoryScroll";
import SeoHealthGauge from "@/components/data/SeoHealthGauge";
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/motion";
import { mapRange, clamp } from "@/lib/utils";

const COST_PER_HOUR = 45;

function computeMetrics(manualHours: number) {
  const automatedHours = manualHours * 0.15;
  const savedHours = manualHours - automatedHours;
  const monthlySavings = savedHours * COST_PER_HOUR;
  const annualSavings = monthlySavings * 12;
  const seoScore = clamp(Math.round(mapRange(manualHours, 0, 200, 25, 98)), 0, 100);
  return { automatedHours, savedHours, monthlySavings, annualSavings, seoScore };
}

export default function RoiEngine() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [manualHours, setManualHours] = useState(80);

  const metrics = useMemo(() => computeMetrics(manualHours), [manualHours]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setManualHours(Number(e.target.value));
  }, []);

  return (
    <SectionReveal id="roi" className="py-32 lg:py-40">
      <div ref={ref} className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="data-label text-pulse mb-4 block">AI AUDIT</span>
            <h2 className="text-display font-heading font-bold text-shimmer">
              RockMount ROI Engine
            </h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">
              Calculate your operational savings. See how autonomous agents
              transform manual overhead into strategic advantage.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Control Panel */}
              <motion.div
                variants={slideInLeft}
                className="relative border-strata rounded-xl bg-surface-card p-8"
              >
                {/* Brushed metal texture overlay */}
                <div
                  className="absolute inset-0 rounded-xl opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-pulse animate-pulse-glow" />
                    <span className="data-label">CONTROL PANEL</span>
                  </div>

                  <label className="block mb-6">
                    <span className="text-sm text-white/60 block mb-3">
                      Current Manual Hours / Month
                    </span>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={manualHours}
                        onChange={handleSliderChange}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-pulse
                          [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(128,110,255,0.5)]
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-moz-range-thumb]:w-5
                          [&::-moz-range-thumb]:h-5
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:bg-pulse
                          [&::-moz-range-thumb]:border-none
                          [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(128,110,255,0.5)]
                          [&::-moz-range-thumb]:cursor-pointer"
                      />
                      <span className="font-mono text-2xl font-bold text-white w-16 text-right">
                        {manualHours}
                      </span>
                    </div>
                  </label>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-surface rounded-lg p-4">
                      <span className="data-label block mb-2">HOURS SAVED</span>
                      <span className="data-value text-2xl font-bold text-emerald-400">
                        {Math.round(metrics.savedHours)}h
                      </span>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <span className="data-label block mb-2">MONTHLY $</span>
                      <span className="data-value text-2xl font-bold text-emerald-400">
                        ${metrics.monthlySavings.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <span className="data-label block mb-2">ANNUAL $</span>
                      <span className="data-value text-2xl font-bold text-pulse">
                        ${metrics.annualSavings.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <span className="data-label block mb-2">EFFICIENCY</span>
                      <span className="data-value text-2xl font-bold text-white">
                        {manualHours > 0
                          ? `${Math.round((metrics.savedHours / manualHours) * 100)}%`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Gauge Panel */}
              <motion.div
                variants={slideInRight}
                className="relative border-strata rounded-xl bg-surface-card p-8 flex flex-col items-center justify-center"
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                  }}
                />

                <div className="relative w-full">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="data-label">SEO HEALTH SCORE</span>
                  </div>

                  <SeoHealthGauge score={metrics.seoScore} />

                  <div className="mt-8 text-center">
                    <p className="text-sm text-white/40 max-w-xs mx-auto">
                      Score reflects estimated operational health improvement
                      based on automation of{" "}
                      <span className="text-white font-mono">
                        {manualHours}
                      </span>{" "}
                      manual hours.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
