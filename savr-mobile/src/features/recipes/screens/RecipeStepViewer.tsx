import React, { memo, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  ViewToken,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { Recipe, RecipeStep } from '../types/types';
import { COLORS, FONT, SPACING, RADIUS } from '../../../theme';

const { width: W, height: H } = Dimensions.get('window');

// ─── Step page ────────────────────────────────────────────────────────────────

interface StepPageProps {
  step: RecipeStep;
  recipe: Recipe;
  index: number;
  total: number;
  isActive: boolean;
}

const StepPage = memo(({ step, recipe, index, total, isActive }: StepPageProps) => {
  const isIntro = index === 0;
  const isOutro  = index === total - 1;

  // Progress ring values
  const progress = (index + 1) / total;

  return (
    <View style={styles.page}>
      <ImageBackground
        source={{ uri: recipe.image }}
        style={styles.pageBg}
        resizeMode="cover"
      >
        {/* Dark overlay — heavier at bottom */}
        <View style={styles.bgOverlayTop} />
        <View style={styles.bgOverlayBottom} />

        <SafeAreaView style={styles.pageSafe}>
          {/* ── Top bar ── */}
          <Animated.View
            entering={isActive ? FadeInDown.delay(100).duration(400) : undefined}
            style={styles.topBar}
          >
            {/* Progress pills */}
            <View style={styles.progressPills}>
              {Array.from({ length: total }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.pill,
                    i < index && styles.pillDone,
                    i === index && styles.pillActive,
                  ]}
                />
              ))}
            </View>

            {/* Recipe title */}
            <Text style={styles.recipeTitle} numberOfLines={1}>
              {recipe.title}
            </Text>
          </Animated.View>

          {/* ── Centre content ── */}
          <View style={styles.centre}>
            {isIntro ? (
              <Animated.View
                entering={isActive ? FadeIn.delay(200).duration(500) : undefined}
                style={styles.introBlock}
              >
                <View style={styles.introBadge}>
                  <Text style={styles.introBadgeText}>Recipe</Text>
                </View>
                <Text style={styles.introTitle}>{recipe.title}</Text>
                <Text style={styles.introDesc}>{recipe.description}</Text>
                <View style={styles.introMeta}>
                  {[
                    { icon: '⏱', value: recipe.duration },
                    { icon: '🔥', value: `${recipe.calories} cal` },
                    { icon: '📋', value: `${recipe.steps.length} steps` },
                  ].map(({ icon, value }) => (
                    <View key={value} style={styles.introMetaItem}>
                      <Text style={styles.introMetaIcon}>{icon}</Text>
                      <Text style={styles.introMetaValue}>{value}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.swipeHint}>
                  <Text style={styles.swipeHintText}>Swipe up to start</Text>
                  <Text style={styles.swipeHintArrow}>↑</Text>
                </View>
              </Animated.View>
            ) : isOutro ? (
              <Animated.View
                entering={isActive ? FadeIn.delay(200).duration(500) : undefined}
                style={styles.outroBlock}
              >
                <Text style={styles.outroEmoji}>🎉</Text>
                <Text style={styles.outroTitle}>Recipe complete!</Text>
                <Text style={styles.outroSubtitle}>
                  Time to plate and enjoy your {recipe.title}.
                </Text>
                <View style={styles.outroTags}>
                  {recipe.tags.map(tag => (
                    <View key={tag} style={styles.outroTag}>
                      <Text style={styles.outroTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            ) : null}
          </View>

          {/* ── Bottom step card ── */}
          {!isIntro && !isOutro && (
            <Animated.View
              entering={isActive ? FadeInUp.delay(150).duration(450).springify() : undefined}
              style={styles.stepCard}
            >
              {/* Step counter + duration */}
              <View style={styles.stepMeta}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>
                    Step {step.stepNumber}
                  </Text>
                </View>
                {step.duration && (
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationIcon}>⏱</Text>
                    <Text style={styles.durationText}>{step.duration}</Text>
                  </View>
                )}
              </View>

              {/* Step title */}
              <Text style={styles.stepTitle}>{step.title}</Text>

              {/* Step description */}
              <Text style={styles.stepDesc}>{step.description}</Text>

              {/* Scroll nudge */}
              <View style={styles.nudge}>
                <Text style={styles.nudgeText}>
                  {index < total - 2 ? 'Next step ↑' : 'Last step ↑'}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* ── Progress fraction ── */}
          {!isIntro && (
            <Animated.View
              entering={isActive ? FadeIn.delay(300).duration(400) : undefined}
              style={styles.fraction}
            >
              <Text style={styles.fractionText}>
                {isOutro ? `${total - 1}` : `${index}`}
                <Text style={styles.fractionDivider}> / {total - 1}</Text>
              </Text>
            </Animated.View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
});

// ─── Main viewer ──────────────────────────────────────────────────────────────

interface RecipeStepViewerProps {
  recipe: Recipe;
  onClose: () => void;
}

type PageData = { type: 'intro' | 'step' | 'outro'; step?: RecipeStep; index: number };

export const RecipeStepViewer = memo(({ recipe, onClose }: RecipeStepViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Build page list: intro + steps + outro
  const pages: PageData[] = [
    { type: 'intro', index: 0 },
    ...recipe.steps.map((step, i) => ({ type: 'step' as const, step, index: i + 1 })),
    { type: 'outro', index: recipe.steps.length + 1 },
  ];
  const total = pages.length;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: H,
      offset: H * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PageData; index: number }) => (
      <StepPage
        step={item.step ?? recipe.steps[0]}
        recipe={recipe}
        index={index}
        total={total}
        isActive={index === activeIndex}
      />
    ),
    [recipe, total, activeIndex]
  );

  const keyExtractor = useCallback(
    (_: PageData, index: number) => `page-${index}`,
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={Platform.OS === 'ios'} />

      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        inverted
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
        decelerationRate="fast"
        snapToInterval={H}
        snapToAlignment="start"
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        style={styles.list}
      />

      {/* Close button — always on top */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={{ top: 12, left: 12, bottom: 12, right: 12 }}>
        <View style={styles.closeInner}>
          <Text style={styles.closeIcon}>✕</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  list: {
    flex: 1,
  },

  // Page
  page: {
    width: W,
    height: H,
  },
  pageBg: {
    flex: 1,
  },
  bgOverlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 1,
  },
  bgOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.55,
    backgroundColor: 'rgba(0,0,0,0.72)',
    zIndex: 1,
  },
  pageSafe: {
    flex: 1,
    zIndex: 2,
  },

  // Top bar
  topBar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.sm,
  },
  progressPills: {
    flexDirection: 'row',
    gap: 4,
  },
  pill: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  pillDone: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  pillActive: {
    backgroundColor: '#fff',
  },
  recipeTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT.sizes.sm,
    fontWeight: FONT.weights.medium,
    letterSpacing: 0.2,
  },

  // Centre
  centre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },

  // Intro block
  introBlock: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  introBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  introBadgeText: {
    color: '#fff',
    fontSize: FONT.sizes.xs,
    fontWeight: FONT.weights.bold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  introTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: FONT.weights.bold,
    textAlign: 'center',
    lineHeight: 36,
  },
  introDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONT.sizes.md,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: W * 0.8,
  },
  introMeta: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginTop: SPACING.sm,
  },
  introMetaItem: {
    alignItems: 'center',
    gap: 4,
  },
  introMetaIcon: {
    fontSize: 20,
  },
  introMetaValue: {
    color: '#fff',
    fontSize: FONT.sizes.sm,
    fontWeight: FONT.weights.semibold,
  },
  swipeHint: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: 2,
    opacity: 0.6,
  },
  swipeHintText: {
    color: '#fff',
    fontSize: FONT.sizes.sm,
  },
  swipeHintArrow: {
    color: '#fff',
    fontSize: 18,
  },

  // Outro block
  outroBlock: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  outroEmoji: {
    fontSize: 64,
  },
  outroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: FONT.weights.bold,
  },
  outroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT.sizes.md,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: W * 0.75,
  },
  outroTags: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  outroTag: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  outroTagText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT.sizes.sm,
  },

  // Step card
  stepCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    backgroundColor: 'rgba(18,18,18,0.92)',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: SPACING.sm,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stepBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  stepBadgeText: {
    color: '#fff',
    fontSize: FONT.sizes.xs,
    fontWeight: FONT.weights.bold,
    letterSpacing: 0.5,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  durationIcon: {
    fontSize: 11,
  },
  durationText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT.sizes.xs,
    fontWeight: FONT.weights.medium,
  },
  stepTitle: {
    color: '#fff',
    fontSize: FONT.sizes.xl,
    fontWeight: FONT.weights.bold,
    lineHeight: 26,
  },
  stepDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT.sizes.md,
    lineHeight: 24,
  },
  nudge: {
    alignItems: 'flex-end',
    marginTop: SPACING.xs,
  },
  nudgeText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: FONT.sizes.xs,
  },

  // Progress fraction
  fraction: {
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  fractionText: {
    color: '#fff',
    fontSize: FONT.sizes.xl,
    fontWeight: FONT.weights.bold,
  },
  fractionDivider: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: FONT.sizes.md,
    fontWeight: FONT.weights.regular,
  },

  // Close button
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 16,
    right: SPACING.lg,
    zIndex: 100,
  },
  closeInner: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: FONT.weights.bold,
  },
});
