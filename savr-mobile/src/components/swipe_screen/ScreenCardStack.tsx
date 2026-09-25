import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { scheduleOnRN } from 'react-native-worklets';

import { Recipe } from '../../types/recipe.types';
import { RecipeContentPager } from './RecipeContentPager'
import { RecipeScreenContent } from './RecipeScreenContent';
import { ScreenCard } from './ScreenCard';

interface ScreenCardStackProps {
  recipes: Recipe[];
}

const SWIPE_THRESHOLD = 120;
const SWIPE_DURATION = 250;

const PEEK_OFFSET = 24;
const BACK_CARD_SCALE = 0.96;

const EXIT_DISTANCE_MULTIPLIER = 1.2;

export function ScreenCardStack({
  recipes,
}: ScreenCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width } = useWindowDimensions();

  /*
   * Horizontal gesture translation.
   *
   * 0    = centered
   * < 0  = left
   * > 0  = right
   */
  const translateX = useSharedValue(0);

  /*
   * ----------------------------------------
   * CURRENT CARD
   * ----------------------------------------
   */
  const currentCardStyle = useAnimatedStyle(() => {
    const rotation = (translateX.value / width) * 10;

    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          rotate: `${rotation}deg`,
        },
      ],
    };
  });

  /*
   * ----------------------------------------
   * PREVIOUS CARD
   * ----------------------------------------
   *
   * The previous card is sitting slightly
   * to the right at rest.
   *
   * As we swipe right it moves toward center.
   */
  const previousCardStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [0, width],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: progress,

      transform: [
        {
          translateX: interpolate(
            progress,
            [0, 1],
            [PEEK_OFFSET, 0],
          ),
        },
        {
          scale: interpolate(
            progress,
            [0, 1],
            [BACK_CARD_SCALE, 1],
          ),
        },
      ],
    };
  });

  /*
   * ----------------------------------------
   * NEXT CARD
   * ----------------------------------------
   *
   * The next card is sitting slightly
   * to the left at rest.
   *
   * As we swipe left it moves toward center.
   */
  const nextCardStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [-width, 0],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: progress,

      transform: [
        {
          translateX: interpolate(
            progress,
            [0, 1],
            [-PEEK_OFFSET, 0],
          ),
        },
        {
          scale: interpolate(
            progress,
            [0, 1],
            [BACK_CARD_SCALE, 1],
          ),
        },
      ],
    };
  });

  /*
   * ----------------------------------------
   * COMPLETE SWIPE
   * ----------------------------------------
   *
   * IMPORTANT:
   *
   * We don't reset translateX until AFTER
   * React has changed the index AND the
   * new card is rendered.
   */
  const completeSwipe = (newIndex: number) => {
    /*
     * Change which recipe is active.
     */
    setCurrentIndex(newIndex);

    /*
     * We intentionally do NOT reset translateX
     * here.
     *
     * The old outgoing position remains until
     * the next frame.
     */
    requestAnimationFrame(() => {
      translateX.value = 0;
    });
  };

  /*
   * ----------------------------------------
   * GESTURE
   * ----------------------------------------
   */
  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      const translation = translateX.value;

      /*
       * -----------------------------
       * LEFT
       * -----------------------------
       */
      if (translation <= -SWIPE_THRESHOLD) {
        /*
         * Last card boundary.
         */
        if (currentIndex >= recipes.length - 1) {
          translateX.value = withSpring(0);
          return;
        }

        translateX.value = withTiming(
          -width * EXIT_DISTANCE_MULTIPLIER,
          {
            duration: SWIPE_DURATION,
          },
          (finished) => {
            if (finished) {
              scheduleOnRN(
                completeSwipe,
                currentIndex + 1,
              );
            }
          },
        );

        return;
      }

      /*
       * -----------------------------
       * RIGHT
       * -----------------------------
       */
      if (translation >= SWIPE_THRESHOLD) {
        /*
         * First card boundary.
         */
        if (currentIndex <= 0) {
          translateX.value = withSpring(0);
          return;
        }

        translateX.value = withTiming(
          width * EXIT_DISTANCE_MULTIPLIER,
          {
            duration: SWIPE_DURATION,
          },
          (finished) => {
            if (finished) {
              scheduleOnRN(
                completeSwipe,
                currentIndex - 1,
              );
            }
          },
        );

        return;
      }

      /*
       * -----------------------------
       * CANCELLED SWIPE
       * -----------------------------
       */
      translateX.value = withSpring(0);
    });

  if (recipes.length === 0) {
    return null;
  }

  /*
   * Only render the three recipes surrounding
   * the current recipe.
   */
  const startIndex = Math.max(
    0,
    currentIndex - 1,
  );

  const endIndex = Math.min(
    recipes.length - 1,
    currentIndex + 1,
  );

  const visibleIndices: number[] = [];

  for (
    let index = startIndex;
    index <= endIndex;
    index += 1
  ) {
    visibleIndices.push(index);
  }

  return (
    <View style={styles.container}>
      {visibleIndices.map((index) => {
        const recipe = recipes[index];

        /*
         * ------------------------------------
         * CURRENT
         * ------------------------------------
         */
        if (index === currentIndex) {
          return (
            <GestureDetector
              key={recipe.id}
              gesture={gesture}
            >
              <Animated.View
                style={[
                  styles.card,
                  styles.currentCard,
                  currentCardStyle,
                ]}
              >
                <ScreenCard>
                  <RecipeContentPager
                    recipe={recipe}
                  />
                </ScreenCard>
              </Animated.View>
            </GestureDetector>
          );
        }

        /*
         * ------------------------------------
         * PREVIOUS
         * ------------------------------------
         */
        if (index === currentIndex - 1) {
          return (
            <Animated.View
              key={recipe.id}
              style={[
                styles.card,
                styles.backgroundCard,
                previousCardStyle,
              ]}
            >
              <ScreenCard>
                <RecipeScreenContent
                  recipe={recipe}
                />
              </ScreenCard>
            </Animated.View>
          );
        }

        /*
         * ------------------------------------
         * NEXT
         * ------------------------------------
         */
        return (
          <Animated.View
            key={recipe.id}
            style={[
              styles.card,
              styles.backgroundCard,
              nextCardStyle,
            ]}
          >
            <ScreenCard>
              <RecipeScreenContent
                recipe={recipe}
              />
            </ScreenCard>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  card: {
    ...StyleSheet.absoluteFill,
  },

  backgroundCard: {
    zIndex: 0,
  },

  currentCard: {
    zIndex: 2,
  },
});