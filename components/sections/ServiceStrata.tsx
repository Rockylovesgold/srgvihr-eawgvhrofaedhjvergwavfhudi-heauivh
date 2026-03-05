"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { SectionReveal } from "@/components/layout/StoryScroll";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/motion";

interface ServiceExhibit {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  metric: { label: string; value: string };
  span?: string;
}

const EXHIBITS: ServiceExhibit[] = [
  {
    title: "Neural Automation",
    subtitle: "EXHIBIT 001",
    description: "End-to-end workflow automation powered by custom language models trained on your operational data.",
    stack: ["Python", "OpenAI", "LangChain", "Celery"],
    metric: { label: "TASKS AUTOMATED", value: "2.4M+" },
    span: "lg:col-span-2",
  },
  {
    title: "Predictive Analytics",
    subtitle: "EXHIBIT 002",
    description: "Real-time pattern recognition across multi-dimensional datasets for strategic forecasting.",
    stack: ["TensorFlow", "BigQuery", "dbt", "Streamlit"],
    metric: { label: "PREDICTION ACCURACY", value: "94.7%" },
  },
  {
    title: "Conversational AI",
    subtitle: "EXHIBIT 003",
    description: "Context-aware dialogue systems that handle complex multi-turn enterprise conversations.",
    stack: ["GPT-4", "RAG", "Pinecone", "Next.js"],
    metric: { label: "RESOLUTION RATE", value: "87%" },
  },
  {
    title: "Data Infrastructure",
    subtitle: "EXHIBIT 004",
    description: "Scalable data pipelines and real-time processing architectures for enterprise integration.",
    stack: ["Kafka", "Spark", "Snowflake", "Airflow"],
    metric: { label: "EVENTS / SEC", value: "50K+" },
    span: "lg:col-span-2",
  },
  {
    title: "Security & Compliance",
    subtitle: "EXHIBIT 005",
    description: "AI-driven threat detection and automated compliance monitoring across regulatory frameworks.",
    stack: ["Vault", "AWS KMS", "SOC2", "HIPAA"],
    metric: { label: "COMPLIANCE SCORE", value: "100%" },
  },
  {
    title: "Custom Agent Design",
    subtitle: "EXHIBIT 006",
    description: "Bespoke autonomous agents designed for your unique business logic and decision frameworks.",
    stack: ["AutoGen", "CrewAI", "FastAPI", "Redis"],
    metric: { label: "AGENTS DEPLOYED", value: "340+" },
  },
];

function ExhibitCard({ exhibit }: { exhibit: ServiceExhibit }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={scaleIn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group cursor-pointer overflow-hidden rounded-xl
        bg-surface-card border-strata min-h-[280px]
        ${exhibit.span || ""}
      `}
    >
      {/* Rock texture background */}
      <div
        className="absolute inset-0 opacity-[0.06] transition-opacity duration-700 group-hover:opacity-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(192,192,192,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(128,110,255,0.1) 0%, transparent 50%),
            repeating-conic-gradient(rgba(255,255,255,0.02) 0% 25%, transparent 0% 50%)
          `,
          backgroundSize: "100% 100%, 100% 100%, 30px 30px",
        }}
      />

      {/* Crack reveal — code stack underneath */}
      <motion.div
        className="absolute inset-0 bg-surface flex flex-col items-center justify-center gap-3 p-6"
        initial={{ clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" }}
        animate={
          isHovered
            ? { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
            : { clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" }
        }
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <span className="data-label text-pulse mb-2">TECH STACK</span>
        <div className="flex flex-wrap gap-2 justify-center">
          {exhibit.stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 bg-pulse/10 border border-pulse/20 rounded-md
                font-mono text-xs text-pulse"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="data-label block mb-1">{exhibit.metric.label}</span>
          <span className="font-mono text-2xl font-bold text-white">
            {exhibit.metric.value}
          </span>
        </div>
      </motion.div>

      {/* Front face */}
      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-between pointer-events-none">
        <div>
          <span className="data-label text-white/20 block mb-3">
            {exhibit.subtitle}
          </span>
          <h3 className="font-heading text-headline font-bold text-white mb-3">
            {exhibit.title}
          </h3>
          <p className="text-sm text-white/40 max-w-md leading-relaxed">
            {exhibit.description}
          </p>
        </div>
        <div className="mt-6">
          <span className="text-xs font-mono text-white/20 uppercase tracking-widest group-hover:text-pulse/60 transition-colors">
            [ hover to reveal ]
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServiceStrata() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <SectionReveal id="services" className="py-32 lg:py-40">
      <div ref={ref} className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="data-label text-pulse mb-4 block">
              SERVICE STRATA
            </span>
            <h2 className="text-display font-heading font-bold text-shimmer">
              The Exhibitions
            </h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">
              Each capability is an exhibit — engineered, tested, and deployed
              at enterprise scale.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-4">
            {EXHIBITS.map((exhibit) => (
              <ExhibitCard key={exhibit.title} exhibit={exhibit} />
            ))}
          </div>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
