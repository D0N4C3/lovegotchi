export const Colors = {
  // ─── Backgrounds ───────────────────────────────────────────────
  background: '#1C1529',
  backgroundLight: '#1B1430',

  // ─── Surfaces ──────────────────────────────────────────────────
  surface: 'rgba(255,255,255,0.07)',
  surfaceActive: 'rgba(127,119,221,0.10)',
  surfaceElevated: 'rgba(255,255,255,0.16)',
  surfaceWarm: 'rgba(255,214,224,0.20)',

  // ─── Borders ───────────────────────────────────────────────────
  border: 'rgba(255,255,255,0.12)',
  borderActive: 'rgba(127,119,221,0.60)',
  borderLight: 'rgba(255,255,255,0.34)',

  // ─── Primary (Purple) ──────────────────────────────────────────
  primary: '#7F77DD',
  primaryLight: '#AFA9EC',
  primaryDark: '#534AB7',
  primaryGlow: 'rgba(127,119,221,0.35)',

  // ─── Secondary (Pink / Rose) ───────────────────────────────────
  secondary: '#D4537E',
  secondaryLight: '#ED93B1',
  secondaryGlow: 'rgba(212,83,126,0.35)',

  // ─── Accent & Special ──────────────────────────────────────────
  accent: '#AFA9EC',           // primary light — used for links, inline highlights
  accentWarm: '#FFD6E0',       // warm pink accent (formerly `accent`)
  moonBlue: '#70C2FF',
  teal: '#1D9E75',
  tealLight: '#5DCAA5',

  // ─── Text ──────────────────────────────────────────────────────
  text: '#F0EEF8',
  textMuted: 'rgba(240,238,248,0.45)',
  textHint: 'rgba(240,238,248,0.30)',
  textLight: '#A996BD',
  textDark: '#31162B',

  // ─── Semantic ──────────────────────────────────────────────────
  danger: '#FF6A8E',
  success: '#8FF0C4',

  // ─── Shadows ───────────────────────────────────────────────────
  shadow: 'rgba(11,5,24,0.58)',
  shadowStrong: 'rgba(7,3,18,0.80)',

  // ─── Decorative ────────────────────────────────────────────────
  star: '#F9F2FF',
  moon: '#FFF3CE',

  // ─── Gradients ─────────────────────────────────────────────────
  gradients: {
    primary: ['#7F77DD', '#D4537E'] as const,          // main CTA buttons
    nightSky: ['#120B23', '#1E1539', '#2A1E4D'] as const,
    dawn: ['#3A2558', '#7A3D7C', '#FF7FA3'] as const,
    aurora: [
      'rgba(255,142,178,0.26)',
      'rgba(167,139,250,0.18)',
      'rgba(112,194,255,0.14)',
    ] as const,
    cardGlow: ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.03)'] as const,
  },
} as const;

export default Colors;