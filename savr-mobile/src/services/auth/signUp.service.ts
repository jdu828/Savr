
import { supabase } from '../../lib/supabase';

export type SignUpInput = {
  email: string;
  password: string;
  username?: string;
};

/**
* Registers a new user with Supabase Auth.
*
* Passes the optional username as user metadata so the database
* trigger can create the user's profile and preferences.
*
* @param input - The user's email, password, and optional username.
* @returns The Supabase signup data, including the user and session.
* @throws {AuthError} If Supabase rejects the signup request.
*/
export async function signUp({
  email,
  password,
  username,
}: SignUpInput) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username?.trim();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: normalizedUsername
        ? { username: normalizedUsername }
        : {},
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
