
import { useState } from 'react';
import {
  updateProfile,
  type UpdateProfileInput,
} from '../services/auth/updateProfile.service';
import type { User } from '../types/user.types';

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    input: UpdateProfileInput
  ): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      return await updateProfile(input);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to update profile.';

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    update,
    loading,
    error,
  };
}
