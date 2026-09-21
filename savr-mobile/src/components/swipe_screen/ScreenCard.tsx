import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

interface ScreenCardProps {
  children: ReactNode;
  animatedStyle?: object;
  backgroundColor?: string;
}

/**
 * Generic full-screen UI component for displaying screen content.
 *
 * ScreenCard is responsible only for the visual structure of a card.
 * It does not know what type of content is being displayed.
 *
 * Content is provided through children, allowing the card to display
 * titles, instructions, videos, images, metadata, or other UI formats.
 */
export function ScreenCard({
  children,
  animatedStyle,
  backgroundColor = '#F5F1E8',
}: ScreenCardProps) {
  return (
    <Animated.View
      style={[
        ScreenCard_Styles.card,
        { backgroundColor },
        animatedStyle,
      ]}
    >
      {/* Provides the full available area for the card's content. */}
      <View style={ScreenCard_Styles.content}>
        {children}
      </View>
    </Animated.View>
  );
}

const ScreenCard_Styles = StyleSheet.create({
  // Makes the card fill the entire area provided by ScreenCardStack.
  card: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  // Allows card content to occupy the entire card.
  content: {
    flex: 1,
  },
});