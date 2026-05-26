import { getRecipeById } from '../recipes/getRecipe.service';
import { supabase } from '../../lib/supabase';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('getRecipeById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure supabase.from is a mock for each test
    (supabase as any).from = jest.fn();
  });

  it('should fetch a recipe by id successfully', async () => {
    const mockRecipe = { id: '1', title: 'Pasta', instructions: 'Boil water...' };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockImplementation(async () => ({ data: mockRecipe, error: null })),
        }),
      }),
    });

    const result = await getRecipeById('1');
    expect(result).toEqual(mockRecipe);
  });

  it('should throw error when recipe not found', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockImplementation(async () => ({ data: null, error: null })),
        }),
      }),
    });

    await expect(getRecipeById('invalid-id')).rejects.toThrow('Recipe not found');
  });

  it('should throw error when database query fails', async () => {
    const mockError = { message: 'Network error' };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockImplementation(async () => ({ data: null, error: mockError })),
        }),
      }),
    });

    await expect(getRecipeById('1')).rejects.toThrow('Network error');
  });
});
