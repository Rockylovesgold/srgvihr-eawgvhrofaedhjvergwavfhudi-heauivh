import StoryScroll from "@/components/layout/StoryScroll";
import Hero3D from "@/components/sections/Hero3D";
import Services from "@/components/sections/Services";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";

function Footer() {
  return (
    <footer id="contact" className="py-20" style={{ borderTop: "1px solid rgba(192,255,255,0.06)" }}>
      <div className="section-container">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <span className="text-xl font-bold text-white tracking-tight block mb-4">
              ROCKMOUNT AI
            </span>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: "#71717A" }}>
              We architect AI systems that act, think, and scale. Bespoke
              automation for strategic enterprises.
            </p>
          </div>
          <div>
            <h4 className="data-label mb-4" style={{ color: "#A1A1AA" }}>PLATFORM</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "#71717A" }}>
              <li><a href="#services" className="hover:text-white transition-colors">Platform</a></li>
              <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
              <li><a href="#case-studies" className="hover:text-white transition-colors">UK Case Studies</a></li>
              <li><a href="#partnerships" className="hover:text-white transition-colors">Partnerships</a></li>
            </ul>
          </div>
          <div>
            <h4 className="data-label mb-4" style={{ color: "#A1A1AA" }}>COMPANY</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "#71717A" }}>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(192,255,255,0.04)" }}>
          <span className="font-mono text-xs" style={{ color: "#52525B" }}>
            &copy; {new Date().getFullYear()} ROCKMOUNT AI — ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <StoryScroll>
      <Hero3D />

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(192,255,255,0.08), transparent)" }} />

      <Services />

      <section id="audit-demo" className="py-28 lg:py-36">
        <div className="section-container text-center">
          <span className="data-label mb-4 block" style={{ color: "#806EFF" }}>
            READY TO TRANSFORM
          </span>
          <h2 className="text-display font-heading font-bold text-metallic-gradient mb-6">
            Start Your AI Journey
          </h2>
          <p className="max-w-lg mx-auto mb-10 text-lg" style={{ color: "#A1A1AA" }}>
            See how RockMount AI can automate your operations, qualify your
            leads, and cut operational costs — all with a single platform.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <MagneticButton className="btn-cta text-base px-10 py-4 bg-transparent">
              Request Demo
              <ArrowRight size={18} />
            </MagneticButton>
          </div>
        </div>
      </section>

      <Footer />
    </StoryScroll>
  );
}
