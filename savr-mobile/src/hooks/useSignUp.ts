
import { useState } from 'react';
import { signUp } from '../services/auth/signUp.service';

type UseSignUpResult = {
  isLoading: boolean;
  error: string | null;
  isConfirmationPending: boolean;
  submitSignUp: (
    email: string,
    password: string,
    username?: string,
  ) => Promise<boolean>;
  clearError: () => void;
};

export function useSignUp(): UseSignUpResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationPending, setIsConfirmationPending] =
    useState(false);

  async function submitSignUp(
    email: string,
    password: string,
    username?: string,
  ): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    setIsConfirmationPending(false);

    try {
      console.log('[useSignUp] Starting signup:', {
        email,
        hasUsername: Boolean(username),
      });

      const data = await signUp({ email, password, username });

      console.log('[useSignUp] Supabase signup response:', {
        hasUser: Boolean(data.user),
        userId: data.user?.id,
        hasSession: Boolean(data.session),
        identitiesCount: data.user?.identities?.length,
        identities: data.user?.identities?.map((identity) => ({
          provider: identity.provider,
          identityId: identity.identity_id,
        })),
      });

      if (data.user && data.user.identities?.length === 0) {
        console.warn(
          '[useSignUp] Duplicate email detected:',
          email,
        );

        setError(
          'An account with this email address already exists.',
        );
        return false;
      }

      if (data.user && !data.session) {
        console.log(
          '[useSignUp] Email confirmation is pending.',
        );
        setIsConfirmationPending(true);
      }

      if (!data.user) {
        console.warn(
          '[useSignUp] Signup returned no user and no explicit error.',
        );

        // Generic error message that the UX sees
        setError(
          'Unable to create your account. Please try again.',
        );

        return false;
      }

      const success = true;

      console.log('[useSignUp] Signup result:', { success });

      return success;
    } catch (err: unknown) {
      console.error('[useSignUp] Signup failed:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your account. Please try again.',
      );

      return false;
    } finally {
      console.log('[useSignUp] Signup request finished.');
      setIsLoading(false);
    }
  }

  function clearError(): void {
    setError(null);
  }

  return {
    isLoading,
    error,
    isConfirmationPending,
    submitSignUp,
    clearError,
  };
}
