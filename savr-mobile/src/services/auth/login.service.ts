
import { supabase } from '../../lib/supabase';

export type LoginInput = {
  identifier: string;
  identifierType: 'email' | 'username' | 'phone';
  password: string;
};

type LoginResponse = {
  user: {
    id: string;
    email?: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  } | null;
};

/**
 * Authenticates an existing user using their email, phone number, or username.
 *
 * Email matching is case-insensitive. Phone number and username matching
 * are resolved by the Supabase login Edge Function.
 *
 * Persists the returned authentication session in the local Supabase client.
 *
 * @param input - The user's email, phone number, or username and password.
 * @returns The authenticated user and persisted session.
 * @throws {Error} If credentials are missing, authentication fails,
 * or session persistence fails.
 */
export async function login({
  identifier,
  identifierType,
  password,
}: LoginInput) {
  const normalizedIdentifier = identifier.trim();

  if (!normalizedIdentifier || !password) {
    throw new Error('Identifier and password are required.');
  }

  const loginIdentifier =
    identifierType === 'email'
      ? normalizedIdentifier.toLowerCase()
      : normalizedIdentifier;

  const { data, error } =
    await supabase.functions.invoke<LoginResponse>('login', {
      body: {
        identifier: loginIdentifier,
        identifierType,
        password,
      },
    });

  if (error || !data?.session) {
    throw new Error('Invalid credentials, or unable to log in.');
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

  if (sessionError) {
    throw sessionError;
  }

  return sessionData;
}