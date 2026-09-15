import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Recipe } from '../../types/recipe.types';
import { RecipeCard } from './RecipeCard';

interface RecipeCardStackProps {
  recipes: Recipe[];
}

const SWIPE_THRESHOLD = 120;

export function RecipeCardStack({
  recipes,
}: RecipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();

  const translateX = useSharedValue(0);

  const currentRecipe = recipes[currentIndex];
  const nextRecipe = recipes[currentIndex + 1];

  const moveToNextCard = () => {
    setCurrentIndex((index) => index + 1);
    translateX.value = 0;
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) >= SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? 1 : -1;

        translateX.value = withTiming(
          direction * width * 1.2,
          {
            duration: 250,
          },
          (finished) => {
            if (finished) {
              runOnJS(moveToNextCard)();
            }
          },
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotation = (translateX.value / width) * 10;

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  if (!currentRecipe) {
    return null;
  }

  return (
    <View style={styles.container}>
      {nextRecipe && (
        <View style={[styles.card, styles.nextCard]}>
          <RecipeCard recipe={nextRecipe} />
        </View>
      )}

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.card,
            animatedCardStyle,
          ]}
        >
          <RecipeCard recipe={currentRecipe} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  nextCard: {
    zIndex: 0,
  },
});