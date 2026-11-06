
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@react-native-vector-icons/feather';
import { useRouter } from 'expo-router';

import { useLogout } from '../src/hooks/useLogout';
import { useUpdateProfile } from '../src/hooks/useUpdateProfile';
import { BottomNavigationBar } from '../src/components/navigation/BottomNavigationBar';
import { getAccount } from '../src/services/auth/account.service';

export default function ProfileScreen() {
  const router = useRouter();

  const {
    isLoading,
    error: logoutError,
    submitLogout,
  } = useLogout();

  const {
    update,
    loading: isUpdating,
    error: updateError,
  } = useUpdateProfile();

  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAccount(): Promise<void> {
      try {
        const account = await getAccount();

        if (isMounted) {
          setUsername(account.username);
          setName(account.name);
        }
      } catch (error: unknown) {
        console.error('Failed to load account:', error);
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    void loadAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleEdit(): void {
    setEditedUsername(username ?? '');
    setEditedName(name ?? '');
    setIsEditing(true);
  }

  function handleCancel(): void {
    setEditedUsername(username ?? '');
    setEditedName(name ?? '');
    setIsEditing(false);
  }

  async function handleSave(): Promise<void> {
    try {
      const updatedUser = await update({
        username: editedUsername,
        name: editedName,
      });

      setUsername(updatedUser.username);
      setName(updatedUser.name);
      setIsEditing(false);
    } catch {
      // The hook exposes the error through updateError.
    }
  }

  async function handleLogout(): Promise<void> {
    const success = await submitLogout();

    if (success) {
      router.replace('/login');
    }
  }

  const displayedName = isLoadingProfile
    ? 'Loading...'
    : name || 'Name not found';

  const displayedUsername = isLoadingProfile
    ? 'Loading...'
    : username || 'Username unavailable';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Feather name="user" size={48} color="#777168" />
        </View>

        <Text style={styles.displayedName}>
          {displayedName}
        </Text>

        <Text style={styles.username}>
          @{displayedUsername}
        </Text>
      </View>

      <View style={styles.detailsSection}>
        {isEditing ? (
          <>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Personal name</Text>

              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                placeholderTextColor="#A49D91"
                editable={!isUpdating}
                maxLength={50}
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.inputRow}>
              <Text style={styles.label}>Username</Text>

              <TextInput
                style={styles.input}
                value={editedUsername}
                onChangeText={setEditedUsername}
                placeholder="Enter your username"
                placeholderTextColor="#A49D91"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isUpdating}
                maxLength={30}
              />
            </View>

            {updateError && (
              <Text style={styles.errorText} accessibilityRole="alert">
                {updateError}
              </Text>
            )}

            <View style={styles.editActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={isUpdating}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.saveButton,
                  isUpdating && styles.buttonDisabled,
                ]}
                onPress={handleSave}
                disabled={isUpdating || !editedUsername.trim()}
                accessibilityRole="button"
              >
                <Feather name="check" size={17} color="#FFFFFF" />
                <Text style={styles.saveText}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Personal name</Text>
              <Text style={styles.value}>{displayedName}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>@{displayedUsername}</Text>
            </View>

            <Pressable
              style={styles.editButton}
              onPress={handleEdit}
              disabled={isLoadingProfile}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              <Feather name="edit-2" size={17} color="#777168" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.logoutSection}>
        {logoutError && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {logoutError}
          </Text>
        )}

        <Pressable
          style={[
            styles.logoutButton,
            isLoading && styles.buttonDisabled,
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
  displayedName: {
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
  inputRow: {
    paddingVertical: 14,
    gap: 8,
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
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: '#292720',
    backgroundColor: '#F5F1E8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E0D7',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E0D7',
    paddingVertical: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777168',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 16,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F1E8',
    borderRadius: 12,
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777168',
  },
  saveButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#292720',
    borderRadius: 12,
    paddingVertical: 14,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
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
