import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Recipe } from '../src/types/recipe.types';
import { ScreenCardStack } from '../src/components/swipe_screen/ScreenCardStack';

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Creamy Garlic Pasta',
    description: 'A simple creamy pasta with garlic and parmesan.',
    skill_level: 2,
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    total_time_minutes: 30,
    servings: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Crispy Chicken Tacos',
    description: 'Crispy chicken tacos with fresh toppings and lime.',
    skill_level: 2,
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    total_time_minutes: 35,
    servings: 4,
    created_at: new Date().toISOString(),
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScreenCardStack recipes={mockRecipes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});