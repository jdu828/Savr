import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Recipe } from '../../types/recipe.types';

interface RecipeScreenContentProps {
  recipe: Recipe;
}

/**
 * Displays recipe-specific content inside a generic ScreenCard.
 *
 * This component is responsible only for how recipe data
 * is presented. ScreenCard remains completely recipe-agnostic.
 */
export function RecipeScreenContent({
  recipe,
}: RecipeScreenContentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {recipe.title}
        </Text>

        {recipe.description && (
          <Text style={styles.description}>
            {recipe.description}
          </Text>
        )}
      </View>

      <View style={styles.metadata}>
        {recipe.total_time_minutes !== null && (
          <Text style={styles.metadataText}>
            {recipe.total_time_minutes} min
          </Text>
        )}

        <Text style={styles.metadataText}>
          Serves {recipe.servings ?? '—'}
        </Text>

        <Text style={styles.metadataText}>
          Skill {recipe.skill_level}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 32,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 16,
  },

  description: {
    fontSize: 18,
    lineHeight: 26,
  },

  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },

  metadataText: {
    fontSize: 16,
    fontWeight: '600',
  },
});