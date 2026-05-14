import Colors from './colors';

export const Theme = {
  colors: Colors,
  spacing: { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 },
  radii: { sm: 10, md: 16, lg: 24, pill: 999 },
  typography: {
    h1: { fontSize: 30, fontWeight: '800' as const },
    h2: { fontSize: 22, fontWeight: '700' as const },
    body: { fontSize: 15, fontWeight: '500' as const },
    caption: { fontSize: 12, fontWeight: '500' as const },
  },
  durations: { fast: 140, normal: 220, slow: 320 },
};

export default Theme;
