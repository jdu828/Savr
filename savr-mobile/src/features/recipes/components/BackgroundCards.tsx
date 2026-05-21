import React, { memo } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { Recipe } from '../types/types';
import { CARD, COLORS, SPACING } from '../../../theme/index';

// This component renders the next 2 cards in the deck with a peeking effect


interface BackgroundCardsProps {
  recipes: Recipe[];
  currentIndex: number;
  translateX: SharedValue<number>;
}

const PEEK_SCALE_2 = 0.88;
const PEEK_SCALE_1 = 0.94;
const PEEK_TRANSLATE_2 = 32;
const PEEK_TRANSLATE_1 = 16;

export const BackgroundCards = memo(
  ({ recipes, currentIndex, translateX }: BackgroundCardsProps) => {
    const card1 = recipes[currentIndex + 1];
    const card2 = recipes[currentIndex + 2];

    // Animated style for the card immediately behind the top card
    const card1Style = useAnimatedStyle(() => {
      const progress = Math.abs(translateX.value) / (CARD.WIDTH * 0.5);
      const scale = interpolate(
        progress,
        [0, 1],
        [PEEK_SCALE_1, 1],
        Extrapolation.CLAMP
      );
      const translateY = interpolate(
        progress,
        [0, 1],
        [PEEK_TRANSLATE_1, 0],
        Extrapolation.CLAMP
      );
      return { transform: [{ scale }, { translateY }] };
    });

    // Card 2 only starts peeking when card 1 is halfway swiped away, creating a staggered effect
    const card2Style = useAnimatedStyle(() => {
      const progress = Math.abs(translateX.value) / (CARD.WIDTH * 0.5);
      const scale = interpolate(
        progress,
        [0, 1],
        [PEEK_SCALE_2, PEEK_SCALE_1],
        Extrapolation.CLAMP
      );
      const translateY = interpolate(
        progress,
        [0, 1],
        [PEEK_TRANSLATE_2, PEEK_TRANSLATE_1],
        Extrapolation.CLAMP
      );
      return { transform: [{ scale }, { translateY }] };
    });

    return (
      <>
        {card2 && (
          <Animated.View style={[styles.backgroundCard, card2Style]}>
            <ImageBackground
              source={{ uri: card2.image }}
              style={styles.image}
              imageStyle={styles.imageStyle}
              resizeMode="cover"
            >
              <View style={styles.scrim} />
              <View style={styles.label}>
                <Text style={styles.labelText} numberOfLines={1}>
                  {card2.title}
                </Text>
              </View>
            </ImageBackground>
          </Animated.View>
        )}

        {card1 && (
          <Animated.View style={[styles.backgroundCard, card1Style]}>
            <ImageBackground
              source={{ uri: card1.image }}
              style={styles.image}
              imageStyle={styles.imageStyle}
              resizeMode="cover"
            >
              <View style={styles.scrim} />
              <View style={styles.label}>
                <Text style={styles.labelText} numberOfLines={1}>
                  {card1.title}
                </Text>
              </View>
            </ImageBackground>
          </Animated.View>
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  backgroundCard: {
    position: 'absolute',
    width: CARD.WIDTH,
    height: CARD.HEIGHT,
    borderRadius: CARD.BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: CARD.BORDER_RADIUS,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  label: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  labelText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    fontWeight: '600',
  },
});
