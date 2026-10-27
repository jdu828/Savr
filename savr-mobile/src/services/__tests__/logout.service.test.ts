
import { supabase } from '../../lib/supabase';
import { logout } from '../auth/logout.service';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

const mockSignOut = jest.mocked(supabase.auth.signOut);

describe('logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signs the user out successfully', async () => {
    mockSignOut.mockResolvedValue({
      error: null,
    });

    await expect(logout()).resolves.toBeUndefined();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledWith();
  });



  it('throws when Supabase sign-out returns an error', async () => {
    const authError = new Error('Unable to sign out.');

    mockSignOut.mockResolvedValue({
      error: authError as Awaited<
        ReturnType<typeof supabase.auth.signOut>
      >['error'] & {},
    });

    await expect(logout()).rejects.toThrow('Unable to sign out.');

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });



  it('propagates unexpected errors thrown by sign-out', async () => {
    mockSignOut.mockRejectedValue(
      new Error('Network connection failed.'),
    );

    await expect(logout()).rejects.toThrow(
      'Network connection failed.',
    );

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
