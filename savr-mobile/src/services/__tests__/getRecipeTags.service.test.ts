import { getRecipeTags } from '../recipeTags/getRecipeTags.service';
import { supabase } from '../../lib/supabase';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('getRecipeTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase as any).from = jest.fn();
  });

  it('should fetch tags and map names', async () => {
    const mockData = [
      { id: 't1', recipe_id: 'r1', tag_id: 'tag1', tags: [{ name: 'Vegan' }] },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({ data: mockData, error: null })),
      }),
    });

    const result = await getRecipeTags('r1');
    expect(result[0].name).toBe('Vegan');
  });

  it('should return empty array when none', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({ data: [], error: null })),
      }),
    });

    const result = await getRecipeTags('r1');
    expect(result).toEqual([]);
  });

  it('should throw when db errors', async () => {
    const mockError = { message: 'fail' };
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({ data: null, error: mockError })),
      }),
    });

    await expect(getRecipeTags('r1')).rejects.toThrow('fail');
  });
});
