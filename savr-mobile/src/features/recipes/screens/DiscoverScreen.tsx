import React, { memo, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { MOCK_RECIPES } from '../data/mockData';
import { useSwipeDeck } from '../hooks/useSwipeDeck';
import { RecipeCard } from '../components/RecipeCard';
import { BackgroundCards } from '../components/BackgroundCards';
import { SwipeButtons } from '../components/SwipeButtons';
import { RecipeStepViewer } from './RecipeStepViewer';
import { Recipe } from '../types/types';
import { COLORS, FONT, SPACING, RADIUS, CARD } from '../../../theme';

export const DiscoverScreen = memo(() => {
  const {
    cardAnimatedStyle,
    overlayLikeStyle,
    overlayPassStyle,
    gesture,
    currentIndex,
    swipeLeft,
    swipeRight,
    recipes,
    translateX,
  } = useSwipeDeck(MOCK_RECIPES);

  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const currentRecipe = recipes[currentIndex];
  const remaining = recipes.length - currentIndex;

  const handleSave  = useCallback(() => swipeRight(), [swipeRight]);
  const handlePass  = useCallback(() => swipeLeft(), [swipeLeft]);
  const handleOpen  = useCallback((recipe: Recipe) => setViewingRecipe(recipe), []);
  const handleClose = useCallback(() => setViewingRecipe(null), []);

  if (!currentRecipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>You've seen it all</Text>
          <Text style={styles.emptySubtitle}>Come back later for more recipes</Text>
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetText}>Start over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>{remaining} recipes left</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Card deck */}
      <View style={styles.deckContainer}>
        <BackgroundCards
          recipes={recipes}
          currentIndex={currentIndex}
          translateX={translateX}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View style={styles.topCardWrapper}>
            <RecipeCard
              recipe={currentRecipe}
              cardStyle={cardAnimatedStyle}
              overlayLikeStyle={overlayLikeStyle}
              overlayPassStyle={overlayPassStyle}
            />
            <TouchableWithoutFeedback onPress={() => handleOpen(currentRecipe)}>
              <View style={styles.tapTarget} />
            </TouchableWithoutFeedback>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Hints */}
      <View style={styles.hintRow}>
        <View style={styles.hintItem}>
          <View style={[styles.hintDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.hintText}>Swipe left to pass</Text>
        </View>
        <View style={styles.hintItem}>
          <View style={[styles.hintDot, { backgroundColor: COLORS.success }]} />
          <Text style={styles.hintText}>Swipe right to save</Text>
        </View>
      </View>
      <View style={styles.tapHintRow}>
        <Text style={styles.tapHintText}>Tap card to cook</Text>
      </View>

      {/* Action buttons */}
      <SwipeButtons onPass={handlePass} onSave={handleSave} />

      {/* Step viewer modal */}
      <Modal
        visible={viewingRecipe !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        {viewingRecipe && (
          <RecipeStepViewer recipe={viewingRecipe} onClose={handleClose} />
        )}
      </Modal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONT.sizes.xl,
    fontWeight: FONT.weights.bold,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizes.sm,
    marginTop: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterIcon: { fontSize: 16 },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCardWrapper: {
    width: CARD.WIDTH,
    height: CARD.HEIGHT,
    position: 'absolute',
  },
  tapTarget: {
    ...StyleSheet.absoluteFillObject,
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    paddingBottom: 2,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  hintText: {
    color: COLORS.textTertiary,
    fontSize: FONT.sizes.xs,
  },
  tapHintRow: {
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  tapHintText: {
    color: COLORS.textTertiary,
    fontSize: FONT.sizes.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  emptyEmoji: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT.sizes.xl,
    fontWeight: FONT.weights.bold,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizes.md,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  resetText: {
    color: COLORS.text,
    fontWeight: FONT.weights.semibold,
    fontSize: FONT.sizes.md,
  },
});
