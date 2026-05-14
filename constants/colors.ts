export const Colors = {
  // Base backgrounds - deep warm twilight
  background: "#1A1625",
  backgroundLight: "#242030",
  surface: "rgba(255, 255, 255, 0.06)",
  surfaceElevated: "rgba(255, 255, 255, 0.10)",
  surfaceWarm: "rgba(255, 140, 100, 0.08)",

  // Primary - warm coral sunset
  primary: "#FF8B7B",
  primaryLight: "#FFB5A7",
  primaryDark: "#E06B5A",
  primaryGlow: "rgba(255, 139, 123, 0.35)",

  // Secondary - soft sage
  secondary: "#8FBC8F",
  secondaryLight: "#B8D4B8",
  secondaryGlow: "rgba(143, 188, 143, 0.3)",

  // Accent - golden amber
  accent: "#F5C156",
  accentLight: "#FDE8A0",
  accentGlow: "rgba(245, 193, 86, 0.35)",

  // Text - warm off-white with depth
  text: "#F5EDE6",
  textMuted: "#A89F9A",
  textLight: "#7A726D",
  textDark: "#4A3F35",

  // Borders - subtle warm glass
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.15)",

  // Status
  danger: "#E57373",
  dangerLight: "#FFCDD2",
  success: "#7BC67B",
  successLight: "#C8E6C9",

  // Pet colors
  petPink: "#FF9E8E",
  petCoral: "#FF7B6B",
  petCream: "#FFE8D6",
  petBlush: "#FFB5B5",
  petGlow: "rgba(255, 158, 142, 0.4)",

  // Shadow
  shadow: "rgba(0, 0, 0, 0.3)",
  shadowStrong: "rgba(0, 0, 0, 0.5)",

  // Special atmospheric
  nightBg: "#1A1625",
  nightSurface: "#242030",
  star: "#FFFFFF",
  moon: "#FFF8E7",
  windowSky: "#1E2A4A",
} as const;

export default Colors;
