
import { supabase } from '../../lib/supabase';
import { User } from '../../types/user.types';

export async function getAccount(): Promise<User> {
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
    .select('id, username, name')
    .eq('id', session.user.id)
    .single();

  if (error) {
    throw error;
  }

  return {
    userId: data.id,
    username: data.username,
    name: data.name,
  };
}
