import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Recipe } from '../../types/recipe.types';

interface RecipeCardProps {
  recipe: Recipe;
  animatedStyle?: object;
  backgroundColor?: string;
}

export function RecipeCard({
  recipe,
  animatedStyle,
  backgroundColor = '#F5F1E8',
}: RecipeCardProps) {
  const time = recipe.total_time_minutes;

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor },
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>
            {recipe.title}
          </Text>

          {recipe.description && (
            <Text style={styles.description}>
              {recipe.description}
            </Text>
          )}
        </View>

        <View style={styles.bottomContent}>
          <View style={styles.metaRow}>
            {time !== null && (
              <Text style={styles.metaText}>
                {time} min
              </Text>
            )}

            <Text style={styles.metaText}>
              {getSkillLevelLabel(recipe.skill_level)}
            </Text>

            {recipe.servings !== null && (
              <Text style={styles.metaText}>
                {recipe.servings} servings
              </Text>
            )}
          </View>

          <Text style={styles.swipeHint}>
            Swipe ↑ for steps
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function getSkillLevelLabel(skillLevel: number): string {
  if (skillLevel <= 1) {
    return 'Easy';
  }

  if (skillLevel <= 3) {
    return 'Medium';
  }

  return 'Hard';
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 46,
    color: '#1C1C1C',
  },

  description: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 25,
    color: '#555555',
  },

  bottomContent: {
    gap: 20,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },

  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },

  swipeHint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },
});