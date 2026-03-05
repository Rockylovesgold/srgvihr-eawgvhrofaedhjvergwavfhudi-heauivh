import { SectionReveal } from "@/components/layout/StoryScroll";

const TIMELINE = [
  { year: "2021", event: "Founded with a mission to bring autonomous intelligence to enterprise operations." },
  { year: "2022", event: "First production agent deployed — processing 10K daily decisions for a Fortune 500 client." },
  { year: "2023", event: "Expanded to multi-agent orchestration. Launched the RockMount Core platform." },
  { year: "2024", event: "500+ staff serviced across healthcare, finance, and logistics verticals." },
  { year: "2025", event: "Introduced the ROI Engine and predictive compliance frameworks." },
  { year: "2026", event: "Command Center era — full-stack autonomous operations at planetary scale." },
];

export default function HistoryPage() {
  return (
    <div className="pt-24 pb-32">
      <div className="section-container">
        <div className="mb-16">
          <span className="data-label text-pulse mb-4 block">INSTITUTION</span>
          <h1 className="text-display font-heading font-bold text-shimmer">
            History
          </h1>
          <p className="mt-4 text-white/40 max-w-xl">
            A chronicle of the ascent — from first principles to planetary-scale
            autonomous operations.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-strata to-transparent" />

          <div className="space-y-16">
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex items-start gap-8 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="hidden lg:block flex-1" />
                <div className="relative z-10 w-8 h-8 rounded-full bg-surface-card border border-pulse/40 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-pulse" />
                </div>
                <div className="flex-1 border-strata rounded-xl bg-surface-card p-6">
                  <span className="font-mono text-sm text-pulse font-bold">
                    {item.year}
                  </span>
                  <p className="mt-2 text-white/60 text-sm leading-relaxed">
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
