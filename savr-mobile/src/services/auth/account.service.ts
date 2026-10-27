
import { supabase } from '../../lib/supabase';

export type Account = {
  id: string;
  username: string;
};

export async function getAccount(): Promise<Account> {
  // Retrieve the currently authenticated user.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.user) {
    throw new Error('No authenticated user found.');
  }

  // Fetch the user's public profile using their authenticated user ID.
  const { data, error } = await supabase
    .from('users')
    .select('id, username')
    .eq('id', session.user.id)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    username: data.username,
  };
}
