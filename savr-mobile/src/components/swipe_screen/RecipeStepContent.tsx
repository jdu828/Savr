import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { RecipeStep } from '../../types/recipe.types';

interface RecipeStepContentProps {
  step: RecipeStep;
}

export function RecipeStepContent({
  step,
}: RecipeStepContentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.stepLabel}>
          Step {step.order}
        </Text>

        <Text style={styles.instruction}>
          {step.instruction}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },

  content: {
    alignItems: 'center',
  },

  stepLabel: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },

  instruction: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '600',
    textAlign: 'center',
  },
});