
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@react-native-vector-icons/feather';
import { useRouter } from 'expo-router';

import { useLogout } from '../src/hooks/useLogout';
import { BottomNavigationBar } from '../src/components/navigation/BottomNavigationBar';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    isLoading,
    error,
    submitLogout,
  } = useLogout();

  // Temporary display values until Supabase profile data is connected.
  const username = 'username';
  const personalName = 'Your Name';

  async function handleLogout(): Promise<void> {
    const success = await submitLogout();

    if (success) {
      router.replace('/login');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Feather name="user" size={48} color="#777168" />
        </View>

        <Text style={styles.personalName}>{personalName}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Personal name</Text>
          <Text style={styles.value}>{personalName}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>@{username}</Text>
        </View>
      </View>

      <View style={styles.logoutSection}>
        {error && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Pressable
          style={[
            styles.logoutButton,
            isLoading && styles.logoutButtonDisabled,
          ]}
          onPress={handleLogout}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          <Feather name="log-out" size={18} color="#B54436" />
          <Text style={styles.logoutText}>
            {isLoading ? 'Logging out...' : 'Log out'}
          </Text>
        </Pressable>
      </View>

      <BottomNavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#292720',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#E4DED2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  personalName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#292720',
  },
  username: {
    fontSize: 14,
    color: '#777168',
    marginTop: 6,
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
  },
  detailRow: {
    paddingVertical: 18,
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: '#777168',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#292720',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E0D7',
  },
  logoutSection: {
    marginTop: 28,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B54436',
  },
  errorText: {
    color: '#B54436',
    fontSize: 13,
    marginBottom: 12,
  },
});
