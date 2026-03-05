"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

interface BrushedMetalCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function BrushedMetalCard({
  children,
  className = "",
  hover = true,
}: BrushedMetalCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={`
        relative overflow-hidden rounded-lg bg-surface-card
        border-strata
        ${hover ? "transition-shadow duration-500 hover:glow-pulse" : ""}
        ${className}
      `}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
