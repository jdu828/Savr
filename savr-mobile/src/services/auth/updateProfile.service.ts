
import { supabase } from '../../lib/supabase';
import type { User, UserRow } from '../../types/user.types';

export interface UpdateProfileInput {
  username: string;
  name: string | null;
}

export async function updateProfile(
  input: UpdateProfileInput
): Promise<User> {
  // Retrieve the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error('User is not authenticated.');
  }

  // Update the user's profile
  const { data, error } = await supabase
    .from('users')
    .update({
      username: input.username.trim(),
      name: input.name?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Map database row to frontend model
  const row: UserRow = data;

  return {
    userId: row.id,
    username: row.username,
    name: row.name,
  };
}
