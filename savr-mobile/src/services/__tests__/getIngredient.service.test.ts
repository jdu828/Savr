import { getIngredientById } from '../ingredients/getIngredient.service';
import { supabase } from '../../lib/supabase';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('getIngredientById', () => {
  // Every test will start with a clean slate for the supabase mock
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase as any).from = jest.fn();
  });

  it('should fetch an ingredient by id successfully', async () => {
    const mockIngredient = {
      id: '1',
      name: 'Tomato',
      calories: 18,
    };

    const mockFrom = supabase.from as jest.MockedFunction<any>;

    // Mock the chain of calls: from -> select -> eq -> single
    // .from('ingredients')
    // .select('*')
    // .eq('id', ingredientId)
    // .single();
    const single = jest.fn();
    const eq = jest.fn(() => ({ single }));
    const select = jest.fn(() => ({ eq }));

    mockFrom.mockReturnValue({ select } as any);

    single.mockImplementation(async () => ({
        data: mockIngredient,
        error: null,
    }));

    const result = await getIngredientById('1');

    expect(result).toEqual(mockIngredient);
  });

  it('should throw error when ingredient not found', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockImplementation(async () => ({ data: null, error: null })),
        }),
      }),
    });

    await expect(getIngredientById('invalid-id')).rejects.toThrow('Ingredient not found');
  });

  it('should throw error when database query fails', async () => {
    const mockError = { message: 'Database connection failed' };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockImplementation(async () => ({ data: null, error: mockError })),
        }),
      }),
    });

    await expect(getIngredientById('1')).rejects.toThrow('Database connection failed');
  });
});
