import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useLogin } from '../src/hooks/useLogin';
import { useSignUp } from '../src/hooks/useSignUp';

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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    isLoading,
    error,
    submitLogin,
    clearError,
  } = useLogin();

  const {
    isLoading: isSigningUp,
    error: signUpError,
    isConfirmationPending,
    submitSignUp,
    clearError: clearSignUpError,
  } = useSignUp();

  const isBusy = isLoading || isSigningUp;
  const activeError = isSignUp ? signUpError : error;

  async function handleSubmit() {
    setNotice(null);

    if (isSignUp) {
      const success = await submitSignUp(
        identifier,
        password,
        username.trim() || undefined,
      );

      if (!success) {
        return;
      }

      if (isConfirmationPending) {
        setNotice(
          'Account created. Check your email for a confirmation link before logging in.',
        );
        return;
      }

      // If email confirmation is disabled, signup may establish a session.
      router.replace('/');
      return;
    }

    const success = await submitLogin(identifier, password);

    if (success) {
      router.replace('/');
    }
  }

  function toggleMode() {
    setIsSignUp((current) => !current);
    setNotice(null);
    clearError();
    clearSignUpError();
  }

  function handleIdentifierChange(value: string) {
    setIdentifier(value);
    setNotice(null);

    if (isSignUp) {
      if (signUpError) clearSignUpError();
    } else if (error) {
      clearError();
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setNotice(null);

    if (isSignUp) {
      if (signUpError) clearSignUpError();
    } else if (error) {
      clearError();
    }
  }

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

      {/* Darkens the background to keep text readable. */}
      <View style={styles.darkOverlay} />

      {/* Login and registration content share this screen. */}
      <View style={styles.content}>
        <View style={styles.brand}>
          <Text style={styles.logo}>savr.</Text>

          <Text style={styles.headline}>
            {isSignUp
              ? 'Your next favorite meal starts here.'
              : 'Your next favorite meal starts here.'}
          </Text>

          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Create an account and discover food you love.'
              : "Discover food you'll love to make."}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Optional username appears only during registration. */}
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Username (optional)"
              placeholderTextColor="rgba(245,241,232,0.65)"
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                setNotice(null);
                if (signUpError) clearSignUpError();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isBusy}
              returnKeyType="next"
              accessibilityLabel="Username, optional"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder={
              isSignUp ? 'Email address' : 'Email or username'
            }
            placeholderTextColor="rgba(245,241,232,0.65)"
            value={identifier}
            onChangeText={handleIdentifierChange}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={isSignUp ? 'email' : 'username'}
            textContentType={isSignUp ? 'emailAddress' : 'username'}
            keyboardType={isSignUp ? 'email-address' : 'default'}
            editable={!isBusy}
            returnKeyType="next"
            accessibilityLabel={
              isSignUp ? 'Email address' : 'Email or username'
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(245,241,232,0.65)"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={
              isSignUp ? 'new-password' : 'current-password'
            }
            textContentType={
              isSignUp ? 'newPassword' : 'password'
            }
            editable={!isBusy}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            accessibilityLabel="Password"
          />

          {activeError ? (
            <Text style={styles.errorText} accessibilityRole="alert">
              {activeError}
            </Text>
          ) : null}

          {notice ? (
            <Text style={styles.noticeText} accessibilityRole="alert">
              {notice}
            </Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              isBusy && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
          >
            {isBusy ? (
              <ActivityIndicator color="#24231F" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isSignUp ? 'Create account' : 'Log in'}
              </Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
              isBusy && styles.buttonDisabled,
            ]}
            onPress={toggleMode}
          >
            <Text style={styles.secondaryButtonText}>
              {isSignUp ? 'Back to log in' : 'Create account'}
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
    marginBottom: 28,
    maxWidth: 340,
  },

  logo: {
    color: '#F5F1E8',
    fontSize: 54,
    fontWeight: '800',
    letterSpacing: -3,
    marginBottom: 16,
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

  form: {
    width: '100%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 18,
  },

  input: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,241,232,0.55)',
    backgroundColor: 'rgba(20,19,16,0.3)',
    paddingHorizontal: 18,
    color: '#F5F1E8',
    fontSize: 16,
  },

  errorText: {
    color: '#FFD2CC',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  noticeText: {
    color: '#F5F1E8',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
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

  buttonDisabled: {
    opacity: 0.6,
  },
});
