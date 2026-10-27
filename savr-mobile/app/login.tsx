
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

type LoginIdentifierType = 'email' | 'phone' | 'username';

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
  // Keep separate values for each login method.
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loginUsername, setLoginUsername] = useState('');

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Track which identifier field the user selected.
  const [loginIdentifierType, setLoginIdentifierType] =
    useState<LoginIdentifierType>('email');

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

  // Return the value from the explicitly selected login field.
  function getLoginIdentifier(): string {
    switch (loginIdentifierType) {
      case 'email':
        return email.trim();
      case 'phone':
        return phone.trim();
      case 'username':
        return loginUsername.trim();
    }
  }

  // Validate the selected login identifier before making a request.
  function validateLoginIdentifier(): string | null {
    const identifier = getLoginIdentifier();

    if (!identifier) {
      return 'Please enter your email, phone number, or username.';
    }

    if (loginIdentifierType === 'email') {
      // Require text before and after @, plus a domain containing a dot.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(identifier)) {
        return 'Enter a valid email address, including its domain.';
      }
    }

    if (loginIdentifierType === 'phone') {
      // This field accepts digits only, with no spaces or punctuation.
      if (!/^\d+$/.test(identifier)) {
        return 'Phone number must contain digits only.';
      }

      // E.164 phone numbers contain at most 15 digits.
      if (identifier.length < 7 || identifier.length > 15) {
        return 'Enter a phone number containing 7 to 15 digits.';
      }
    }

    if (loginIdentifierType === 'username' && !identifier) {
      return 'Please enter your username.';
    }

    return null;
  }

  async function handleSubmit() {
    setNotice(null);

    if (isSignUp) {
      // Registration continues to use the email field.
      const normalizedEmail = email.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(normalizedEmail)) {
        setNotice('Enter a valid email address, including its domain.');
        return;
      }

      if (!password) {
        setNotice('Please enter a password.');
        return;
      }

      const success = await submitSignUp(
        normalizedEmail,
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

    // Validate the identifier type the user explicitly selected.
    const validationError = validateLoginIdentifier();

    if (validationError) {
      setNotice(validationError);
      return;
    }

    if (!password) {
      setNotice('Please enter your password.');
      return;
    }

    // Pass the selected type explicitly; never infer it from the value.
    const success = await submitLogin(
      getLoginIdentifier(),
      loginIdentifierType,
      password,
    );

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

  function handleEmailChange(value: string) {
    setEmail(value);
    setNotice(null);

    if (error) clearError();
    if (signUpError) clearSignUpError();
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    setNotice(null);

    if (error) clearError();
  }

  function handleUsernameChange(value: string) {
    setLoginUsername(value);
    setNotice(null);

    if (error) clearError();
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setNotice(null);

    if (error) clearError();
    if (signUpError) clearSignUpError();
  }

  function selectIdentifierType(type: LoginIdentifierType) {
    setLoginIdentifierType(type);
    setNotice(null);
    clearError();
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
            Your next favorite meal starts here.
          </Text>

          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Create an account and discover food you love.'
              : "Discover food you'll love to make."}
          </Text>
        </View>

        <View style={styles.form}>
          {isSignUp ? (
            <>
              {/* Username is optional during registration. */}
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

              {/* Registration uses email, not phone or username. */}
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="rgba(245,241,232,0.65)"
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                editable={!isBusy}
                returnKeyType="next"
                accessibilityLabel="Email address"
              />
            </>
          ) : (
            <>
              {/* Let users explicitly select their login identifier type. */}
              <View style={styles.identifierSelector}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: loginIdentifierType === 'email',
                  }}
                  disabled={isBusy}
                  onPress={() => selectIdentifierType('email')}
                  style={[
                    styles.identifierOption,
                    loginIdentifierType === 'email' &&
                      styles.identifierOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.identifierOptionText,
                      loginIdentifierType === 'email' &&
                        styles.identifierOptionTextSelected,
                    ]}
                  >
                    Email
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: loginIdentifierType === 'phone',
                  }}
                  disabled={isBusy}
                  onPress={() => selectIdentifierType('phone')}
                  style={[
                    styles.identifierOption,
                    loginIdentifierType === 'phone' &&
                      styles.identifierOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.identifierOptionText,
                      loginIdentifierType === 'phone' &&
                        styles.identifierOptionTextSelected,
                    ]}
                  >
                    Phone
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: loginIdentifierType === 'username',
                  }}
                  disabled={isBusy}
                  onPress={() => selectIdentifierType('username')}
                  style={[
                    styles.identifierOption,
                    loginIdentifierType === 'username' &&
                      styles.identifierOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.identifierOptionText,
                      loginIdentifierType === 'username' &&
                        styles.identifierOptionTextSelected,
                    ]}
                  >
                    Username
                  </Text>
                </Pressable>
              </View>

              {/* Render only the input corresponding to the selected type. */}
              {loginIdentifierType === 'email' && (
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="rgba(245,241,232,0.65)"
                  value={email}
                  onChangeText={handleEmailChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  editable={!isBusy}
                  returnKeyType="next"
                  accessibilityLabel="Email address"
                />
              )}

              {loginIdentifierType === 'phone' && (
                <TextInput
                  style={styles.input}
                  placeholder="Phone number (digits only)"
                  placeholderTextColor="rgba(245,241,232,0.65)"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  editable={!isBusy}
                  returnKeyType="next"
                  accessibilityLabel="Phone number"
                />
              )}

              {loginIdentifierType === 'username' && (
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="rgba(245,241,232,0.65)"
                  value={loginUsername}
                  onChangeText={handleUsernameChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                  textContentType="username"
                  keyboardType="default"
                  editable={!isBusy}
                  returnKeyType="next"
                  accessibilityLabel="Username"
                />
              )}
            </>
          )}

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

  identifierSelector: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,241,232,0.35)',
    backgroundColor: 'rgba(20,19,16,0.3)',
  },

  identifierOption: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  identifierOptionSelected: {
    backgroundColor: '#F5F1E8',
  },

  identifierOptionText: {
    color: '#F5F1E8',
    fontSize: 13,
    fontWeight: '600',
  },

  identifierOptionTextSelected: {
    color: '#24231F',
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
