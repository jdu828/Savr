
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Feather } from '@react-native-vector-icons/feather';

export function BottomNavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => router.replace('/')}
        accessibilityRole="button"
        accessibilityLabel="Home"
      >
        <Feather
          name="home"
          size={25}
          color={isHome ? '#FFFFFF' : '#A0A0A0'}
        />
        <Text style={[styles.label, isHome && styles.activeLabel]}>
          Home
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/profile')}
        accessibilityRole="button"
        accessibilityLabel="Profile"
      >
        <Feather
          name="user"
          size={25}
          color="#A0A0A0"
        />
        <Text style={styles.label}>Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 12,
    paddingBottom: 28,
    zIndex: 100,
    elevation: 100,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,

    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    color: '#D0D0D0',
    fontWeight: '600',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
