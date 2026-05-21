import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SCREEN = { WIDTH: SCREEN_WIDTH, HEIGHT: SCREEN_HEIGHT };

export const COLORS = {
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  primary: '#FF4458',
  primaryLight: '#FF6B7A',
  success: '#22C55E',
  successLight: '#4ADE80',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textTertiary: '#525252',
  border: '#2A2A2A',
  overlay: 'rgba(0,0,0,0.6)',
  cardShadow: 'rgba(0,0,0,0.5)',
  like: '#22C55E',
  pass: '#FF4458',
  likeLabel: 'rgba(34,197,94,0.15)',
  passLabel: 'rgba(255,68,88,0.15)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const FONT = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const CARD = {
  WIDTH: SCREEN_WIDTH - 32,
  HEIGHT: SCREEN_HEIGHT * 0.68,
  BORDER_RADIUS: 24,
};

export const SWIPE = {
  THRESHOLD: SCREEN_WIDTH * 0.28,
  ROTATION_FACTOR: 12,
  OUT_DISTANCE: SCREEN_WIDTH * 1.5,
};
