
import React from 'react';
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PLACEHOLDER_TILES = [
  { emoji: '🥕', label: 'CHOP', color: '#8C6548' },
  { emoji: '🍳', label: 'SIZZLE', color: '#A85D3B' },
  { emoji: '🍝', label: 'TOSS', color: '#6E7350' },
  { emoji: '🥑', label: 'PREP', color: '#63734B' },
  { emoji: '🥘', label: 'SIMMER', color: '#A65E43' },
  { emoji: '🍜', label: 'SLURP', color: '#92704B' },
  { emoji: '🍅', label: 'FRESH', color: '#9C5546' },
  { emoji: '🥞', label: 'FLIP', color: '#A98551' },
  { emoji: '🧄', label: 'SEASON', color: '#81735D' },
  { emoji: '🍰', label: 'BAKE', color: '#A57878' },
  { emoji: '🥦', label: 'ROAST', color: '#647252' },
  { emoji: '🍕', label: 'SERVE', color: '#986347' },
];

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Temporary cooking tiles fill the entire screen. */}
      <View style={styles.background}>
        {PLACEHOLDER_TILES.map((tile, index) => (
          <View
            key={`${tile.label}-${index}`}
            style={[
              styles.tile,
              { backgroundColor: tile.color },
            ]}
          >
            <Text style={styles.tileEmoji}>{tile.emoji}</Text>
            <Text style={styles.tileLabel}>{tile.label}</Text>
          </View>
        ))}
      </View>

      {/* Darkens the background so the foreground text stays readable. */}
      <View style={styles.darkOverlay} />

      {/* Content sits directly over the background, without a panel. */}
      <View style={styles.content}>
        <View style={styles.brand}>
          <Text style={styles.logo}>savr.</Text>

          <Text style={styles.headline}>
            Your next favorite meal starts here.
          </Text>

          <Text style={styles.subtitle}>
            Discover food you'll love to make.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              Alert.alert('Log in', 'Login form coming next.')
            }
          >
            <Text style={styles.primaryButtonText}>Log in</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              Alert.alert(
                'Create account',
                'Registration form coming next.',
              )
            }
          >
            <Text style={styles.secondaryButtonText}>
              Create account
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24231F',
    overflow: 'hidden',
  },

  background: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tile: {
    width: '33.3333%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  tileEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  tileLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },

  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20,19,16,0.57)',
  },

  content: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  brand: {
    alignItems: 'center',
    marginBottom: 44,
    maxWidth: 340,
  },

  logo: {
    color: '#F5F1E8',
    fontSize: 54,
    fontWeight: '800',
    letterSpacing: -3,
    marginBottom: 20,
  },

  headline: {
    color: '#F5F1E8',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 37,
    textAlign: 'center',
    letterSpacing: -0.6,
  },

  subtitle: {
    color: 'rgba(245,241,232,0.82)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },

  actions: {
    width: '100%',
    maxWidth: 340,
    gap: 12,
  },

  primaryButton: {
    minHeight: 54,
    borderRadius: 30,
    backgroundColor: '#F5F1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#24231F',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    minHeight: 54,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#F5F1E8',
    backgroundColor: 'rgba(20,19,16,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#F5F1E8',
    fontSize: 16,
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
