// Palette CAR ONE PLUS — alignée sur la maquette de référence fournie
// (fond sombre, accent or/jaune, logo C1+). Remplace la palette noir/rouge/vert
// du document 01_CHARTE_PRODUIT_UI_UX.md à la demande du porteur de projet.
export const colors = {
  bg: '#0A0D14',
  bgElevated: '#12161F',
  card: '#161B26',
  cardBorder: '#232838',
  gold: '#F5A623',
  goldDark: '#C9820F',
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#A7ADBC',
  textMuted: '#6B7280',
  greyLight: '#F3F4F6',
  green: '#16A34A',
  red: '#E5484D',
  amber: '#F59E0B',
  overlay: 'rgba(10,13,20,0.72)',
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const spacing = (n) => n * 4;

export const typography = {
  h1: { fontSize: 26, fontWeight: '800', color: colors.white },
  h2: { fontSize: 20, fontWeight: '700', color: colors.white },
  h3: { fontSize: 16, fontWeight: '700', color: colors.white },
  body: { fontSize: 15, fontWeight: '400', color: colors.white },
  bodyMuted: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '700', color: colors.bg },
};

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 14,
  elevation: 6,
};
