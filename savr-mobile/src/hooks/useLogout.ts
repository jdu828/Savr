
import { useState } from 'react';
import { logout } from '../services/auth/logout.service';

type UseLogoutResult = {
  isLoading: boolean;
  error: string | null;
  submitLogout: () => Promise<boolean>;
  clearError: () => void;
};

/**
 * Manages the logout flow, including loading and error state.
 *
 * Calls the logout service and exposes a simple interface for the profile UI.
 *
 * @returns Logout state, a submit handler, and an error-reset handler.
 */
export function useLogout(): UseLogoutResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Signs out the currently authenticated user.
   *
   * @returns True when logout succeeds, otherwise false.
   */
  async function submitLogout(): Promise<boolean> {
    if (isLoading) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await logout();
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log out. Please try again.',
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Clears the current logout error.
   */
  function clearError(): void {
    setError(null);
  }

  return {
    isLoading,
    error,
    submitLogout,
    clearError,
  };
}
