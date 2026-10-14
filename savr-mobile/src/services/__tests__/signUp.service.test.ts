
import { supabase } from '../../lib/supabase';
import { signUp } from '../auth/signUp.service';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

const mockSignUp = jest.mocked(supabase.auth.signUp);

describe('signUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes the email and passes the supplied username', async () => {
    mockSignUp.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session: null,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.signUp>>);

    await signUp({
      email: '  TEST@EXAMPLE.COM ',
      password: 'SecurePassword123!',
      username: '  crispy_4821  ',
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'SecurePassword123!',
      options: {
        data: {
          username: 'crispy_4821',
        },
      },
    });
  });

  it('passes empty metadata when no username is supplied', async () => {
    mockSignUp.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session: null,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.signUp>>);

    await signUp({
      email: 'test@example.com',
      password: 'SecurePassword123!',
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'SecurePassword123!',
      options: {
        data: {},
      },
    });
  });

  it('passes empty metadata when the username is blank', async () => {
    mockSignUp.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session: null,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.signUp>>);

    await signUp({
      email: 'test@example.com',
      password: 'SecurePassword123!',
      username: '   ',
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'SecurePassword123!',
      options: {
        data: {},
      },
    });
  });

  it('throws when Supabase returns an error', async () => {
    const authError = new Error('Signup failed');

    mockSignUp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: authError,
    } as Awaited<ReturnType<typeof supabase.auth.signUp>>);

    await expect(
      signUp({
        email: 'test@example.com',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow('Signup failed');
  });
});
