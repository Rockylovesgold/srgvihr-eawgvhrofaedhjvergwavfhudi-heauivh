"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const NAV_LINKS = [
  { label: "Platform", href: "#services" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "UK Case Studies", href: "#case-studies" },
  { label: "Partnerships", href: "#partnerships" },
];

export default function TopNav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.92]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.15]);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-4 left-4 right-4 z-50 rounded-xl"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(0,0,0,${v})`),
        border: useTransform(
          borderOpacity,
          (v) => `1px solid rgba(192,255,255,${v})`,
        ),
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
      }}
    >
      <nav className="flex items-center justify-between h-14 lg:h-16 px-5 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo-new.png"
            alt="RockMount AI"
            width={140}
            height={42}
            className="h-9 lg:h-10 w-auto"
            priority
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium tracking-wide transition-colors duration-300"
              style={{ color: "#A1A1AA" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#A1A1AA")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <MagneticButton className="btn-cta text-xs py-2 px-5 bg-transparent">
            Request Demo
          </MagneticButton>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden px-5 pb-6"
          style={{ borderTop: "1px solid rgba(192,255,255,0.08)" }}
        >
          <div className="pt-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium transition-colors"
                style={{ color: "#A1A1AA" }}
              >
                {link.label}
              </Link>
            ))}
            <MagneticButton className="btn-cta mt-3 w-full text-center bg-transparent">
              Request Demo
            </MagneticButton>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
