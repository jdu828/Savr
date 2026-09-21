import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { scheduleOnRN } from 'react-native-worklets';
import { Recipe } from '../../types/recipe.types';
import { ScreenCard } from './ScreenCard';

interface ScreenCardStackProps {
  recipes: Recipe[];
}

const SWIPE_THRESHOLD = 120;

/**
 * Displays and manages a stack of full-screen cards.
 *
 * ScreenCardStack is responsible for:
 * - determining which card is currently active
 * - displaying the next card underneath
 * - handling horizontal swipe gestures
 * - animating the active card
 * - advancing to the next item after a completed swipe
 *
 * ScreenCardStack does not define the visual content of a card.
 * ScreenCard is responsible for the card UI itself.
 */
export function ScreenCardStack({
  recipes,
}: ScreenCardStackProps) {
  // Tracks the index of the currently active card.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gets the screen width for calculating the swipe exit distance.
  const { width } = useWindowDimensions();

  // Stores the active card's horizontal translation.
  const translateX = useSharedValue(0);

  // Gets the data for the currently active card.
  const currentRecipe = recipes[currentIndex];

  // Gets the data for the next card in the stack.
  const nextRecipe = recipes[currentIndex + 1];

  /**
   * Advances the stack to the next card after a completed swipe.
   *
   * The function runs on the JavaScript thread after the swipe
   * animation has finished.
   */
  const moveToNextCard = () => {
    setCurrentIndex((index) => index + 1);

    // Reset the horizontal position for the newly active card.
    translateX.value = 0;
  };

  /**
   * Defines the horizontal swipe gesture for the active card.
   *
   * The gesture responds only to horizontal movement.
   * Vertical movement causes the gesture to fail.
   */
  const gesture = Gesture.Pan()
    // Require a small amount of horizontal movement before activating.
    .activeOffsetX([-10, 10])

    // Prevent the gesture from activating during vertical movement.
    .failOffsetY([-20, 20])

    // Move the active card with the user's finger.
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })

    // Determine what happens when the user releases the card.
    .onEnd(() => {
      // Dismiss the card if the swipe passes the required threshold.
      if (Math.abs(translateX.value) >= SWIPE_THRESHOLD) {
        // Positive values represent a right swipe.
        // Negative values represent a left swipe.
        const direction = translateX.value > 0 ? 1 : -1;

        // Animate the card completely off-screen.
        translateX.value = withTiming(
          direction * width * 1.2,
          {
            duration: 250,
          },
          (finished) => {
            // Advance the stack after the exit animation completes.
            if (finished) {
              scheduleOnRN(moveToNextCard);
            }
          },
        );
      } else {
        // Return the card to its original position when the swipe
        // does not pass the dismissal threshold.
        translateX.value = withSpring(0);
      }
    });

  /**
   * Creates the animated style for the active card.
   *
   * The card translates horizontally with the gesture and rotates
   * slightly to create a Tinder-style swipe interaction.
   */
  const animatedCardStyle = useAnimatedStyle(() => {
    // Convert horizontal movement into a small rotation.
    const rotation = (translateX.value / width) * 10;

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  // Render nothing when the stack has no cards remaining.
  if (!currentRecipe) {
    return null;
  }

  return (
    <View style={ScreenCardStack_Styles.container}>
      {/* Render the next card underneath the active card. */}
      {nextRecipe && (
        <View
          style={[
            ScreenCardStack_Styles.card,
            ScreenCardStack_Styles.nextCard,
          ]}
        >
          <ScreenCard>
            {/* Temporary recipe content for the MVP. */}
            <View>
              {/* Recipe-specific UI will eventually be its own component. */}
            </View>
          </ScreenCard>
        </View>
      )}

      {/* Attach the horizontal swipe gesture to the active card. */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            ScreenCardStack_Styles.card,
            animatedCardStyle,
          ]}
        >
          <ScreenCard>
            {/* Temporary recipe content for the MVP. */}
            <View>
              {/* Recipe-specific UI will eventually be its own component. */}
            </View>
          </ScreenCard>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const ScreenCardStack_Styles = StyleSheet.create({
  // Makes the card stack fill the entire screen.
  container: {
    flex: 1,
    position: 'relative',
  },

  // Positions each card to completely fill the stack.
  card: {
    ...StyleSheet.absoluteFill,
  },

  // Places the upcoming card behind the active card.
  nextCard: {
    zIndex: 0,
  },
});