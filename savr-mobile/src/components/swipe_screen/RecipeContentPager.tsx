import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

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

import { useRecipeSteps } from '../../hooks/useRecipeSteps';
import { Recipe } from '../../types/recipe.types';

import { RecipeScreenContent } from './RecipeScreenContent';
import { RecipeStepContent } from './RecipeStepContent';

interface RecipeContentPagerProps {
  recipe: Recipe;
}

const SWIPE_THRESHOLD = 120;
const SWIPE_DURATION = 250;
const PEEK_OFFSET = 24;
const BACK_PAGE_SCALE = 0.96;
const EXIT_DISTANCE_MULTIPLIER = 1.2;

export function RecipeContentPager({
  recipe,
}: RecipeContentPagerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { height } = useWindowDimensions();

  const translateY = useSharedValue(0);

  const {
    steps,
    loadSteps,
  } = useRecipeSteps(recipe.id);

  /*
   * Prefetch step data when this recipe
   * becomes the active recipe.
   *
   * This fetches metadata only.
   * It does not render all of the steps.
   */
  useEffect(() => {
    loadSteps().catch(() => {});
  }, [recipe.id]);

  /*
   * ----------------------------------------
   * CURRENT PAGE
   * ----------------------------------------
   */
  const currentPageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  /*
   * ----------------------------------------
   * PREVIOUS PAGE
   * ----------------------------------------
   */
  const previousPageStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [0, height],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: progress,
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [-PEEK_OFFSET, 0],
          ),
        },
        {
          scale: interpolate(
            progress,
            [0, 1],
            [BACK_PAGE_SCALE, 1],
          ),
        },
      ],
    };
  });

  /*
   * ----------------------------------------
   * NEXT PAGE
   * ----------------------------------------
   */
  const nextPageStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [-height, 0],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: progress,
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [PEEK_OFFSET, 0],
          ),
        },
        {
          scale: interpolate(
            progress,
            [0, 1],
            [BACK_PAGE_SCALE, 1],
          ),
        },
      ],
    };
  });

  /*
   * ----------------------------------------
   * COMPLETE PAGE CHANGE
   * ----------------------------------------
   */
  const completeSwipe = (newIndex: number) => {
    setCurrentIndex(newIndex);

    requestAnimationFrame(() => {
      translateY.value = 0;
    });
  };

  /*
   * ----------------------------------------
   * GESTURE
   * ----------------------------------------
   */
  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .failOffsetX([-20, 20])

    .onUpdate((event) => {
      translateY.value = event.translationY;
    })

    .onEnd(() => {
      const translation = translateY.value;

      /*
       * ------------------------------------
       * SWIPE UP
       * ------------------------------------
       */
      if (translation <= -SWIPE_THRESHOLD) {
        /*
         * No steps loaded yet.
         *
         * Don't start a transition that has
         * nothing to transition into.
         */
        if (steps.length === 0) {
          translateY.value = withSpring(0);
          return;
        }

        /*
         * Last step boundary.
         */
        if (currentIndex >= steps.length) {
          translateY.value = withSpring(0);
          return;
        }

        translateY.value = withTiming(
          -height * EXIT_DISTANCE_MULTIPLIER,
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
       * ------------------------------------
       * SWIPE DOWN
       * ------------------------------------
       */
      if (translation >= SWIPE_THRESHOLD) {
        /*
         * Already on the cover.
         */
        if (currentIndex === 0) {
          translateY.value = withSpring(0);
          return;
        }

        translateY.value = withTiming(
          height * EXIT_DISTANCE_MULTIPLIER,
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
       * ------------------------------------
       * CANCELLED SWIPE
       * ------------------------------------
       */
      translateY.value = withSpring(0);
    });

  /*
   * ----------------------------------------
   * PAGE RENDERING
   * ----------------------------------------
   *
   * Index 0 = cover
   * Index 1 = step 1
   * Index 2 = step 2
   * ...
   */
  const renderPage = (index: number) => {
    if (index === 0) {
      return (
        <RecipeScreenContent
          recipe={recipe}
        />
      );
    }

    const step = steps[index - 1];

    if (!step) {
      return null;
    }

    return (
      <RecipeStepContent
        step={step}
      />
    );
  };

  /*
   * ----------------------------------------
   * VISIBLE WINDOW
   * ----------------------------------------
   *
   * Render only:
   *
   * previous
   * current
   * next
   *
   * At the cover:
   *
   * [cover]
   * [step 1]
   *
   * At step 1:
   *
   * [cover]
   * [step 1]
   * [step 2]
   *
   * At step 2:
   *
   * [step 1]
   * [step 2]
   * [step 3]
   */
  const startIndex = Math.max(
    0,
    currentIndex - 1,
  );

  const endIndex = Math.min(
    steps.length,
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
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        {visibleIndices.map((index) => {
          /*
           * CURRENT
           */
          if (index === currentIndex) {
            return (
              <Animated.View
                key={`page-${index}`}
                style={[
                  styles.page,
                  styles.currentPage,
                  currentPageStyle,
                ]}
              >
                {renderPage(index)}
              </Animated.View>
            );
          }

          /*
           * PREVIOUS
           */
          if (index === currentIndex - 1) {
            return (
              <Animated.View
                key={`page-${index}`}
                style={[
                  styles.page,
                  styles.backgroundPage,
                  previousPageStyle,
                ]}
              >
                {renderPage(index)}
              </Animated.View>
            );
          }

          /*
           * NEXT
           */
          return (
            <Animated.View
              key={`page-${index}`}
              style={[
                styles.page,
                styles.backgroundPage,
                nextPageStyle,
              ]}
            >
              {renderPage(index)}
            </Animated.View>
          );
        })}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  page: {
    ...StyleSheet.absoluteFill,
  },

  backgroundPage: {
    zIndex: 0,
  },

  currentPage: {
    zIndex: 2,
  },
});