import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ScreenCardStack } from '../src/components/swipe_screen/ScreenCardStack';
import { useRecipeDiscovery } from '../src/hooks/useRecipeDiscovery';

export default function HomeScreen() {
  const { recipes, loading, error } = useRecipeDiscovery();

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenCardStack recipes={recipes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});