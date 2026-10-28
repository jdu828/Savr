
import { supabase } from '../../lib/supabase';

export type SignUpInput = {
  email: string;
  password: string;
  username?: string;
};

export async function signUp({
  email,
  password,
  username,
}: SignUpInput) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username?.trim();

  console.log('[signUp.service] Sending signup request:', {
    email: normalizedEmail,
    hasUsername: Boolean(normalizedUsername),
  });

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: normalizedUsername
        ? { username: normalizedUsername }
        : {},
      emailRedirectTo: 'savr://profile'
    },
  });

  console.log('[signUp.service] Supabase response:', {
    hasUser: Boolean(data?.user),
    hasSession: Boolean(data?.session),
    identitiesCount: data?.user?.identities?.length,
    error: error
      ? {
          message: error.message,
          code: error.code,
          status: error.status,
        }
      : null,
  });

  if (error) {
    console.error('[signUp.service] Signup error:', error.message);
    throw error;
  }

  return data;
}
