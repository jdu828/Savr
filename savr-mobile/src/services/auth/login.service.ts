
import { supabase } from '../../lib/supabase';

export type LoginInput = {
  identifier: string;
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
 * Authenticates an existing user using their email or username.
 *
 * Username matching is case-insensitive and is resolved securely
 * by the Supabase login Edge Function.
 *
 * Persists the returned authentication session in the local
 * Supabase client.
 *
 * @param input - The user's email or username and password.
 * @returns The authenticated user and persisted session.
 * @throws {Error} If authentication or session persistence fails.
 */
export async function login({
  identifier,
  password,
}: LoginInput) {
  const normalizedIdentifier = identifier.trim();

  const loginIdentifier = normalizedIdentifier.includes('@')
    ? normalizedIdentifier.toLowerCase()
    : normalizedIdentifier;

  const { data, error } =
    await supabase.functions.invoke<LoginResponse>('login', {
      body: {
        identifier: loginIdentifier,
        password,
      },
    });

  if (error || !data?.session) {
    throw new Error(
      'Invalid email/username or password, or unable to log in.',
    );
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
