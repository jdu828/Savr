import { getRecipeSteps } from '../recipeSteps/getRecipeSteps.service';
import { supabase } from '../../lib/supabase';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('getRecipeSteps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase as any).from = jest.fn();
  });

  it('should fetch recipe steps ordered by step_number', async () => {
    const mockData = [
      { id: 's1', recipe_id: 'r1', step_number: 1, instruction: 'Do first' },
      { id: 's2', recipe_id: 'r1', step_number: 2, instruction: 'Do second' },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockImplementation(async () => ({ data: mockData, error: null })),
        }),
      }),
    });

    const result = await getRecipeSteps('r1');
    expect(result).toHaveLength(2);
    expect(result[0].order).toBe(1);
    expect(result[1].instruction).toBe('Do second');
  });

  it('should return empty array when no steps', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockImplementation(async () => ({ data: [], error: null })),
        }),
      }),
    });

    const result = await getRecipeSteps('r1');
    expect(result).toEqual([]);
  });

  it('should throw error when db query fails', async () => {
    const mockError = { message: 'DB fail' };
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockImplementation(async () => ({ data: null, error: mockError })),
        }),
      }),
    });

    await expect(getRecipeSteps('r1')).rejects.toThrow('DB fail');
  });
});
