import { getRecipeIngredients } from '../recipes/getRecipeIngredients.service';
import { supabase } from '../../lib/supabase';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('getRecipeIngredients', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase as any).from = jest.fn();
  });

  it('should fetch recipe ingredients successfully', async () => {
    const mockData = [
      {
        id: '1',
        recipe_id: 'recipe-1',
        ingredient_id: 'ing-1',
        quantity: 2,
        unit: 'cups',
        is_optional: false,
        ingredients: [{ name: 'Flour' }],
      },
      {
        id: '2',
        recipe_id: 'recipe-1',
        ingredient_id: 'ing-2',
        quantity: 1,
        unit: 'egg',
        is_optional: false,
        ingredients: [{ name: 'Egg' }],
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({ data: mockData, error: null })),
      }),
    });

    const result = await getRecipeIngredients('recipe-1');
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      recipeIngredientId: '1',
      ingredientId: 'ing-1',
      recipeId: 'recipe-1',
      name: 'Flour',
      quantity: 2,
      unit: 'cups',
      isOptional: false,
    });
    expect(result[1].name).toBe('Egg');
  });

  it('should return empty array when no ingredients found', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({ data: [], error: null })),
      }),
    });

    const result = await getRecipeIngredients('recipe-1');
    expect(result).toEqual([]);
  });

  it('should throw error when database query fails', async () => {
    const mockError = { message: 'Database error' };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({ data: null, error: mockError })),
      }),
    });

    await expect(getRecipeIngredients('recipe-1')).rejects.toThrow('Database error');
  });

  it('should handle missing ingredient name gracefully', async () => {
    const mockData = [
      {
        id: '1',
        recipe_id: 'recipe-1',
        ingredient_id: null,
        quantity: 2,
        unit: 'cups',
        is_optional: false,
        ingredients: null,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({ data: mockData, error: null })),
      }),
    });

    const result = await getRecipeIngredients('recipe-1');
    expect(result[0].ingredientId).toBe('');
    expect(result[0].name).toBe('');
  });
});
