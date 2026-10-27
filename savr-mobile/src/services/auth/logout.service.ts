
import { supabase } from '../../lib/supabase';

/**
 * Signs out the currently authenticated user.
 *
 * Clears the Supabase authentication session.
 *
 * @throws {Error} If logout or session termination fails.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
