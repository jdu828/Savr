
import { useState } from 'react';
import { login } from '../services/auth/login.service';

type UseLoginResult = {
  isLoading: boolean;
  error: string | null;
  submitLogin: (
    identifier: string,
    password: string,
  ) => Promise<boolean>;
  clearError: () => void;
};

/**
 * Manages the login flow, including loading and error state.
 *
 * Calls the login service and exposes a simple interface for the login UI.
 *
 * @returns Login state, a submit handler, and an error-reset handler.
 */
export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submits email/username and password to authenticate the user.
   *
   * @param identifier - The user's email address or username.
   * @param password - The user's password.
   * @returns True when login succeeds, otherwise false.
   */
  async function submitLogin(
    identifier: string,
    password: string,
  ): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    try {
      await login({ identifier, password });
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log in. Please try again.',
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Clears the current login error.
   */
  function clearError(): void {
    setError(null);
  }

  return {
    isLoading,
    error,
    submitLogin,
    clearError,
  };
}
