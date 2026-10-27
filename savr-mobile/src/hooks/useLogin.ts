
import { useState } from 'react';
import { login } from '../services/auth/login.service';

type IdentifierType = 'email' | 'username' | 'phone';

type UseLoginResult = {
  isLoading: boolean;
  error: string | null;
  submitLogin: (
    identifier: string,
    identifierType: IdentifierType,
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
   * Submits an email address, username, or phone number and password.
   *
   * @param identifier - The user's email, username, or phone number.
   * @param identifierType - Explicitly identifies the type of login identifier.
   * @param password - The user's password.
   * @returns True when login succeeds, otherwise false.
   */
  async function submitLogin(
    identifier: string,
    identifierType: IdentifierType,
    password: string,
  ): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    try {
      await login({
        identifier,
        identifierType,
        password,
      });

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
