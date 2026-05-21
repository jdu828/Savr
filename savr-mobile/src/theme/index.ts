import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// COLORS — full dark palette
export const COLORS = {
  background: '#0F0F0F',      // page bg
  surface: '#1A1A1A',         // cards, inputs
  surfaceElevated: '#242424', // modals, popovers
  primary: '#FF4458',         // brand red (pass / CTA)
  success: '#22C55E',         // green (save / like)
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textTertiary: '#525252',
  border: '#2A2A2A',
} as const;

// SPACING — 4px base scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// FONT
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
} as const;

// RADIUS
export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

// CARD — derived from screen dimensions
export const CARD = {
  WIDTH: SCREEN_WIDTH - 32,
  HEIGHT: SCREEN_HEIGHT * 0.68,
  BORDER_RADIUS: 24,
} as const;

// SWIPE — gesture thresholds
export const SWIPE = {
  THRESHOLD: SCREEN_WIDTH * 0.28, // This is the threshold needed for something to be 
    // considered a swipe and trigger the card to fly out
  ROTATION_FACTOR: 12,      // degrees at edge
  OUT_DISTANCE: SCREEN_WIDTH * 1.5,
} as const;