import MagneticButton from "@/components/ui/MagneticButton";

const EXHIBITS = [
  {
    id: "001",
    title: "Neural Automation Suite",
    period: "2023 — Present",
    description: "End-to-end workflow automation powered by custom language models.",
    status: "ACTIVE",
  },
  {
    id: "002",
    title: "Predictive Analytics Engine",
    period: "2024 — Present",
    description: "Real-time pattern recognition across multi-dimensional datasets.",
    status: "ACTIVE",
  },
  {
    id: "003",
    title: "Conversational Intelligence",
    period: "2023 — Present",
    description: "Context-aware dialogue systems for complex enterprise conversations.",
    status: "ACTIVE",
  },
  {
    id: "004",
    title: "Data Pipeline Architecture",
    period: "2022 — 2024",
    description: "Foundational infrastructure for enterprise-scale data processing.",
    status: "ARCHIVED",
  },
  {
    id: "005",
    title: "Compliance Automation Framework",
    period: "2025 — Present",
    description: "AI-driven regulatory monitoring across SOC2, HIPAA, and GDPR.",
    status: "ACTIVE",
  },
];

export default function ExhibitionsPage() {
  return (
    <div className="pt-24 pb-32">
      <div className="section-container">
        <div className="mb-16">
          <span className="data-label text-pulse mb-4 block">GALLERY</span>
          <h1 className="text-display font-heading font-bold text-shimmer">
            Exhibitions
          </h1>
          <p className="mt-4 text-white/40 max-w-xl">
            A curated collection of our most impactful deployments and
            capabilities — each one an exhibit in autonomous engineering.
          </p>
        </div>

        <div className="space-y-4">
          {EXHIBITS.map((exhibit) => (
            <div
              key={exhibit.id}
              className="group border-strata rounded-xl bg-surface-card p-6 lg:p-8
                flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8
                hover:bg-surface-elevated transition-colors duration-500"
            >
              <span className="font-mono text-sm text-white/20 w-12">
                {exhibit.id}
              </span>
              <div className="flex-1">
                <h2 className="font-heading font-semibold text-xl text-white group-hover:text-shimmer transition-all">
                  {exhibit.title}
                </h2>
                <p className="text-sm text-white/40 mt-1">
                  {exhibit.description}
                </p>
              </div>
              <span className="font-mono text-xs text-white/30">
                {exhibit.period}
              </span>
              <span
                className={`data-label text-xs px-3 py-1 rounded-full border ${
                  exhibit.status === "ACTIVE"
                    ? "text-emerald-400 border-emerald-400/20"
                    : "text-white/30 border-white/10"
                }`}
              >
                {exhibit.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <MagneticButton>Request Private Tour</MagneticButton>
        </div>
      </div>
    </div>
  );
}
