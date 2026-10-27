import { supabase } from '../../lib/supabase';
import { login } from '../auth/login.service';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
    auth: {
      setSession: jest.fn(),
    },
  },
}));

const mockInvoke = jest.mocked(supabase.functions.invoke);
const mockSetSession = jest.mocked(supabase.auth.setSession);

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes an email and persists the returned session', async () => {
    const session = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    };

    const sessionData = {
      user: { id: 'test-user-id', email: 'test@example.com' },
      session,
    };

    mockInvoke.mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.functions.invoke>>);

    mockSetSession.mockResolvedValue({
      data: sessionData,
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.setSession>>);

    await expect(
      login({
        identifier: '  TEST@EXAMPLE.COM ',
        identifierType: 'email',
        password: 'SecurePassword123!',
      }),
    ).resolves.toEqual(sessionData);

    expect(mockInvoke).toHaveBeenCalledWith('login', {
      body: {
        identifier: 'test@example.com',
        identifierType: 'email',
        password: 'SecurePassword123!',
      },
    });

    expect(mockSetSession).toHaveBeenCalledWith({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    });
  });

  it('preserves username casing when invoking the login function', async () => {
    const session = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    };

    mockInvoke.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.functions.invoke>>);

    mockSetSession.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session: null,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.setSession>>);

    await login({
      identifier: '  Crispy_4821  ',
      identifierType: 'username',
      password: 'SecurePassword123!',
    });

    expect(mockInvoke).toHaveBeenCalledWith('login', {
      body: {
        identifier: 'Crispy_4821',
        identifierType: 'username',
        password: 'SecurePassword123!',
      },
    });
  });

  it('supports numeric-only usernames without treating them as phone numbers', async () => {
    const session = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    };

    mockInvoke.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.functions.invoke>>);

    mockSetSession.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.setSession>>);

    await login({
      identifier: '4821',
      identifierType: 'username',
      password: 'SecurePassword123!',
    });

    expect(mockInvoke).toHaveBeenCalledWith('login', {
      body: {
        identifier: '4821',
        identifierType: 'username',
        password: 'SecurePassword123!',
      },
    });
  });

  it('supports phone-number login', async () => {
    const session = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    };

    mockInvoke.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.functions.invoke>>);

    mockSetSession.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.setSession>>);

    await login({
      identifier: '2025550123',
      identifierType: 'phone',
      password: 'SecurePassword123!',
    });

    expect(mockInvoke).toHaveBeenCalledWith('login', {
      body: {
        identifier: '2025550123',
        identifierType: 'phone',
        password: 'SecurePassword123!',
      },
    });
  });

  it('rejects when the login function returns an error', async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: new Error('Function invocation failed'),
    } as Awaited<ReturnType<typeof supabase.functions.invoke>>);

    await expect(
      login({
        identifier: 'test@example.com',
        identifierType: 'email',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow(
      'Invalid credentials, or unable to log in.',
    );

    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it('rejects when the login function returns no session', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session: null,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.functions.invoke>>);

    await expect(
      login({
        identifier: 'test@example.com',
        identifierType: 'email',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow(
      'Invalid credentials, or unable to log in.',
    );

    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it('rejects empty credentials without invoking the login function', async () => {
    await expect(
      login({
        identifier: '   ',
        identifierType: 'email',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow('Identifier and password are required.');

    await expect(
      login({
        identifier: 'test@example.com',
        identifierType: 'email',
        password: '',
      }),
    ).rejects.toThrow('Identifier and password are required.');

    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('throws when session persistence fails', async () => {
    const session = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    };

    mockInvoke.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' },
        session,
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.functions.invoke>>);

    mockSetSession.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: new Error('Session persistence failed'),
    } as Awaited<ReturnType<typeof supabase.auth.setSession>>);

    await expect(
      login({
        identifier: 'test@example.com',
        identifierType: 'email',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow('Session persistence failed');
  });
});