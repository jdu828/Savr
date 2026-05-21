import { useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { SWIPE, SCREEN } from '../../../theme/index';
import { Recipe } from '../types/types';

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

const SNAP_SPRING = {
  damping: 15,
  stiffness: 150,
};

interface UseSwipeDeckReturn {
  translateX: ReturnType<typeof useSharedValue<number>>;
  translateY: ReturnType<typeof useSharedValue<number>>;
  cardAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  overlayLikeStyle: ReturnType<typeof useAnimatedStyle>;
  overlayPassStyle: ReturnType<typeof useAnimatedStyle>;
  gesture: ReturnType<typeof Gesture.Pan>;
  currentIndex: number;
  swipeLeft: () => void;
  swipeRight: () => void;
  recipes: Recipe[];
}

// This hook manages the swipe deck logic, including gesture handling and animations
// It returns animated styles for the card and overlays, as well as handlers for swiping and the current recipe index
// The main logic is in the gesture handler, which updates the card position during the swipe and determines whether to fly out or snap back on release
export function useSwipeDeck(allRecipes: Recipe[]): UseSwipeDeckReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recipes] = useState(allRecipes);

  const translateX = useSharedValue(0); // Follows the X Axis Finger Movement
  const translateY = useSharedValue(0); // Follows the Y Axis Finger Movement
  const scale = useSharedValue(1);

  const advanceCard = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
  }, [translateX, translateY, scale]);

  // Programmatically trigger a swipe in a given direction
  // Used by the buttons to trigger the same animations as a gesture swipe
  const flyOut = useCallback(
    (direction: 'left' | 'right') => {
      const targetX =
        direction === 'right' ? SWIPE.OUT_DISTANCE : -SWIPE.OUT_DISTANCE;
      translateX.value = withTiming(targetX, { duration: 320 }, (finished) => {
        if (finished) runOnJS(advanceCard)();
      });
      translateY.value = withTiming(60, { duration: 320 });
    },
    [translateX, translateY, advanceCard]
  );

  const swipeRight = useCallback(() => flyOut('right'), [flyOut]);
  const swipeLeft = useCallback(() => flyOut('left'), [flyOut]);

  // Gesture handler:
  // - onBegin: card lifts slightly
  // - onUpdate: card follows finger with some vertical dampening
  // - onEnd: if past threshold, fly out; else snap back
  const gesture = Gesture.Pan()
    .onBegin(() => {
      // 1.03 card lifts with the spring
      scale.value = withSpring(1.03, SPRING_CONFIG);
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.25;
    })
    .onEnd((e) => {
      const shouldSwipeRight = e.translationX > SWIPE.THRESHOLD;
      const shouldSwipeLeft = e.translationX < -SWIPE.THRESHOLD;

      if (shouldSwipeRight) {
        translateX.value = withTiming(
          SWIPE.OUT_DISTANCE,
          { duration: 300 },
          (finished) => {
            if (finished) runOnJS(advanceCard)();
          }
        );
        translateY.value = withTiming(60, { duration: 300 });
      } else if (shouldSwipeLeft) {
        translateX.value = withTiming(
          -SWIPE.OUT_DISTANCE,
          { duration: 300 },
          (finished) => {
            if (finished) runOnJS(advanceCard)();
          }
        );
        translateY.value = withTiming(60, { duration: 300 });
      } else {
        // Snap back with spring
        translateX.value = withSpring(0, SNAP_SPRING);
        translateY.value = withSpring(0, SNAP_SPRING);
        scale.value = withSpring(1, SPRING_CONFIG);
      }
    });

  // Animated styles for the card and the like/pass overlays
  // Swipe Left -> Rotate counterclockwise
  // Swipe Right -> Rotate clockwise
  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN.WIDTH / 2, 0, SCREEN.WIDTH / 2],
      [-SWIPE.ROTATION_FACTOR, 0, SWIPE.ROTATION_FACTOR],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
    };
  });

  // Opacity for the "Like" overlay (appears when swiping right)
  const overlayLikeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE.THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Opacity for the "Pass" overlay (appears when swiping left)
  const overlayPassStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE.THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return {
    translateX,
    translateY,
    cardAnimatedStyle,
    overlayLikeStyle,
    overlayPassStyle,
    gesture,
    currentIndex,
    swipeLeft,
    swipeRight,
    recipes,
  };
}
