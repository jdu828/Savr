import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Recipe } from '../types/types';
import { CARD, COLORS, SPACING, FONT, RADIUS } from '../../../theme';

interface RecipeCardProps {
  recipe: Recipe;
  cardStyle: object;
  overlayLikeStyle: object;
  overlayPassStyle: object;
  children?: React.ReactNode;
}

const DifficultyDot = memo(({ difficulty }: { difficulty: Recipe['difficulty'] }) => {
  const color =
    difficulty === 'Easy'
      ? COLORS.success
      : difficulty === 'Medium'
      ? '#F59E0B'
      : COLORS.primary;
  return (
    <View style={[styles.difficultyDot, { backgroundColor: color }]} />
  );
});
DifficultyDot.displayName = 'DifficultyDot';

export const RecipeCard = memo(
  ({ recipe, cardStyle, overlayLikeStyle, overlayPassStyle, children }: RecipeCardProps) => {
    return (
      <Animated.View style={[styles.card, cardStyle]}>
        <ImageBackground
          source={{ uri: recipe.image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          {/* Like overlay */}
          <Animated.View style={[styles.overlayLike, overlayLikeStyle]}>
            <View style={styles.labelLike}>
              <Text style={styles.labelTextLike}>SAVE</Text>
            </View>
          </Animated.View>

          {/* Pass overlay */}
          <Animated.View style={[styles.overlayPass, overlayPassStyle]}>
            <View style={styles.labelPass}>
              <Text style={styles.labelTextPass}>PASS</Text>
            </View>
          </Animated.View>

          {/* Gradient scrim for text legibility */}
          <View style={styles.scrim} />

          {/* Card content */}
          <View style={styles.content}>
            {/* Tags */}
            <View style={styles.tags}>
              {recipe.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {recipe.title}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {recipe.description}
            </Text>

            {/* Meta row */}
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏱</Text>
                <Text style={styles.metaText}>{recipe.duration}</Text>
              </View>
              <View style={styles.metaSeparator} />
              <View style={styles.metaItem}>
                <DifficultyDot difficulty={recipe.difficulty} />
                <Text style={styles.metaText}>{recipe.difficulty}</Text>
              </View>
              <View style={styles.metaSeparator} />
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>🔥</Text>
                <Text style={styles.metaText}>{recipe.calories} cal</Text>
              </View>
              <View style={styles.metaSeparator} />
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>{recipe.steps.length} steps</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {children}
      </Animated.View>
    );
  }
);
RecipeCard.displayName = 'RecipeCard';

const styles = StyleSheet.create({
  card: {
    width: CARD.WIDTH,
    height: CARD.HEIGHT,
    borderRadius: CARD.BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
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
    backgroundColor: 'transparent',
    // Simulate a bottom-heavy gradient scrim
    backgroundImage: undefined,
  },
  overlayLike: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34,197,94,0.18)',
    zIndex: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: SPACING.lg,
  },
  overlayPass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,68,88,0.18)',
    zIndex: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: SPACING.lg,
  },
  labelLike: {
    borderWidth: 3,
    borderColor: COLORS.success,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    transform: [{ rotate: '12deg' }],
  },
  labelPass: {
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    transform: [{ rotate: '-12deg' }],
  },
  labelTextLike: {
    color: COLORS.success,
    fontSize: FONT.sizes.xl,
    fontWeight: FONT.weights.bold,
    letterSpacing: 2,
  },
  labelTextPass: {
    color: COLORS.primary,
    fontSize: FONT.sizes.xl,
    fontWeight: FONT.weights.bold,
    letterSpacing: 2,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    // Dark scrim achieved via backgroundColor with opacity on a View overlay
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: {
    color: COLORS.text,
    fontSize: FONT.sizes.xs,
    fontWeight: FONT.weights.medium,
    letterSpacing: 0.3,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT.sizes.xxl,
    fontWeight: FONT.weights.bold,
    lineHeight: 34,
    marginBottom: SPACING.xs,
  },
  description: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONT.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 13,
  },
  metaText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONT.sizes.xs,
    fontWeight: FONT.weights.medium,
  },
  metaSeparator: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  difficultyDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
  },
});
