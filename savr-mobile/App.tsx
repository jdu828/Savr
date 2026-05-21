import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { DiscoverScreen } from './src/features/recipes/screens/DiscoverScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <DiscoverScreen />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
