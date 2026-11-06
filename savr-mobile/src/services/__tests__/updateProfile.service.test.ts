
import { supabase } from '../../lib/supabase';
import { updateProfile } from '../auth/updateProfile.service';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('updateProfile', () => {
  const mockUserId = 'user-123';

  const mockAuthUser = {
    id: mockUserId,
    email: 'test@example.com',
  };

  const mockUpdatedRow = {
    id: mockUserId,
    username: 'john_cooks',
    name: 'John',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-11-06T12:00:00.000Z',
  };

  const mockGetUser = supabase.auth.getUser as jest.Mock;
  const mockFrom = supabase.from as jest.Mock;

  const mockSingle = jest.fn();
  const mockSelect = jest.fn(() => ({
    single: mockSingle,
  }));
  const mockEq = jest.fn(() => ({
    select: mockSelect,
  }));
  const mockUpdate = jest.fn(() => ({
    eq: mockEq,
  }));

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: mockAuthUser },
      error: null,
    });

    mockFrom.mockReturnValue({
      update: mockUpdate,
    });

    mockSingle.mockResolvedValue({
      data: mockUpdatedRow,
      error: null,
    });
  });

  it('updates the user profile successfully', async () => {
    const result = await updateProfile({
      username: 'john_cooks',
      name: 'John',
    });

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith('users');

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'john_cooks',
        name: 'John',
        updated_at: expect.any(String),
      })
    );

    expect(mockEq).toHaveBeenCalledWith('id', mockUserId);
    expect(mockSelect).toHaveBeenCalledTimes(1);
    expect(mockSingle).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      userId: mockUserId,
      username: 'john_cooks',
      name: 'John',
    });
  });

  it('trims whitespace from username and name', async () => {
    await updateProfile({
      username: '  john_cooks  ',
      name: '  John  ',
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'john_cooks',
        name: 'John',
      })
    );
  });

  it('converts an empty name to null', async () => {
    await updateProfile({
      username: 'john_cooks',
      name: '   ',
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'john_cooks',
        name: null,
      })
    );
  });

  it('allows a null name', async () => {
    await updateProfile({
      username: 'john_cooks',
      name: null,
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: null,
      })
    );
  });

  it('throws an error when authentication fails', async () => {
    const authError = new Error('Authentication failed');

    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: authError,
    });

    await expect(
      updateProfile({
        username: 'john_cooks',
        name: 'John',
      })
    ).rejects.toThrow('Authentication failed');

    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('throws an error when no authenticated user exists', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(
      updateProfile({
        username: 'john_cooks',
        name: 'John',
      })
    ).rejects.toThrow('User is not authenticated.');

    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('throws an error when the username is already taken', async () => {
    const duplicateError = {
      code: '23505',
      message: 'duplicate key value violates unique constraint',
    };

    mockSingle.mockResolvedValue({
      data: null,
      error: duplicateError,
    });

    await expect(
      updateProfile({
        username: 'existing_username',
        name: 'John',
      })
    ).rejects.toEqual(duplicateError);
  });

  it('throws an error when the database update fails', async () => {
    const databaseError = {
      message: 'Database connection failed',
    };

    mockSingle.mockResolvedValue({
      data: null,
      error: databaseError,
    });

    await expect(
      updateProfile({
        username: 'john_cooks',
        name: 'John',
      })
    ).rejects.toEqual(databaseError);
  });
});
