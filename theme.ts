export const colors = {
  surface: "#000000",
  surfaceDeep: "#000600",
  surfaceElevated: "#0A0A0F",
  surfaceCard: "#0D0D12",
  metallic: {
    primary: "#C0FFFF",
    dim: "rgba(192, 255, 255, 0.5)",
    muted: "rgba(192, 255, 255, 0.15)",
  },
  pulse: "#806EFF",
  pulseGlow: "rgba(128, 110, 255, 0.4)",
  text: {
    primary: "#FFFFFF",
    secondary: "#A1A1AA",
    muted: "#71717A",
  },
} as const;

export const motion = {
  heavy: { type: "spring" as const, stiffness: 100, damping: 30 },
  heavySlow: { type: "spring" as const, stiffness: 60, damping: 25 },
  snap: { type: "spring" as const, stiffness: 300, damping: 30 },
  fade: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
} as const;
