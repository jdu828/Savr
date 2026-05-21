import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../../theme';

interface SwipeButtonsProps {
  onPass: () => void;
  onSave: () => void;
}

export const SwipeButtons = memo(({ onPass, onSave }: SwipeButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.passButton]}
        onPress={onPass}
        activeOpacity={0.75}
      >
        <Text style={styles.passIcon}>✕</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={onSave}
        activeOpacity={0.75}
      >
        <Text style={styles.saveIcon}>♥</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  passButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    width: 72,
    height: 72,
  },
  passIcon: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '700',
  },
  saveIcon: {
    fontSize: 26,
    color: '#fff',
  },
});
