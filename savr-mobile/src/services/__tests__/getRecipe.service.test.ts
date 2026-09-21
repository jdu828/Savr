import {
  getRecipeById,
  getRecipesByTagName,
  getRecipesByEquipmentName,
  getRecipesByIngredientName,
  getRecipesByCookTime,
} from '../recipes/getRecipe.service';

import { supabase } from '../../lib/supabase';

import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
} from '@jest/globals';

describe('getRecipeById', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Ensure supabase.from is a mock for each test
    (supabase as any).from = jest.fn();
  });

  it('should fetch a recipe by id successfully', async () => {
    const mockRecipe = {
      id: 'e18d2686-6a9e-4759-8fd9-17c6dce1d70a',
      title: 'Corn Strawberry Cucumber Salad',
      description:
        'A fresh composed salad made with steamed corn, cucumber, cherry tomatoes, strawberries, avocado, feta, and basil.',
      skill_level: 1,
      prep_time_minutes: 15,
      cook_time_minutes: 5,
      total_time_minutes: 20,
      servings: 4,
      created_at: null,
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest
            .fn()
            .mockImplementation(async () => ({
              data: mockRecipe,
              error: null,
            })),
        }),
      }),
    });

    const result = await getRecipeById(
      'e18d2686-6a9e-4759-8fd9-17c6dce1d70a',
    );

    expect(result).toEqual(mockRecipe);
  });

  it('should throw error when recipe not found', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest
            .fn()
            .mockImplementation(async () => ({
              data: null,
              error: null,
            })),
        }),
      }),
    });

    await expect(
      getRecipeById(
        '00000000-0000-0000-0000-000000000000',
      ),
    ).rejects.toThrow('Recipe not found');
  });

  it('should throw error when database query fails', async () => {
    const mockError = {
      message: 'Network error',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest
            .fn()
            .mockImplementation(async () => ({
              data: null,
              error: mockError,
            })),
        }),
      }),
    });

    await expect(
      getRecipeById(
        'e18d2686-6a9e-4759-8fd9-17c6dce1d70a',
      ),
    ).rejects.toThrow('Network error');
  });
});

describe('getRecipesByTagName', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (supabase as any).from = jest.fn();
  });

  it('should fetch recipes by tag name successfully', async () => {
    const mockRecipes = [
      {
        id: 'e18d2686-6a9e-4759-8fd9-17c6dce1d70a',
        title: 'Corn Strawberry Cucumber Salad',
        description:
          'A fresh composed salad made with steamed corn, cucumber, cherry tomatoes, strawberries, avocado, feta, and basil.',
        skill_level: 1,
        prep_time_minutes: 15,
        cook_time_minutes: 5,
        total_time_minutes: 20,
        servings: 4,
        created_at: null,
      },
      {
        id: '6b3d1dfd-12cf-4e8d-b917-2568006b65ee',
        title: 'Garlic Mashed Potatoes',
        description:
          'A classic mashed potato side dish made with boiled potatoes, garlic, butter, and milk.',
        skill_level: 1,
        prep_time_minutes: 15,
        cook_time_minutes: 20,
        total_time_minutes: 35,
        servings: 6,
        created_at: null,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: mockRecipes,
          error: null,
        })),
      }),
    });

    const result = await getRecipesByTagName('vegetarian');

    expect(result).toEqual(mockRecipes);
  });

  it('should return an empty array when no recipes match the tag', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: [],
          error: null,
        })),
      }),
    });

    const result = await getRecipesByTagName(
      'nonexistent-tag',
    );

    expect(result).toEqual([]);
  });

  it('should throw error when database query fails', async () => {
    const mockError = {
      message: 'Network error',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: null,
          error: mockError,
        })),
      }),
    });

    await expect(
      getRecipesByTagName('vegetarian'),
    ).rejects.toThrow('Network error');
  });
});

describe('getRecipesByEquipmentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (supabase as any).from = jest.fn();
  });

  it('should fetch recipes by equipment name successfully', async () => {
    const mockRecipes = [
      {
        id: 'e18d2686-6a9e-4759-8fd9-17c6dce1d70a',
        title: 'Corn Strawberry Cucumber Salad',
        description:
          'A fresh composed salad made with steamed corn, cucumber, cherry tomatoes, strawberries, avocado, feta, and basil.',
        skill_level: 1,
        prep_time_minutes: 15,
        cook_time_minutes: 5,
        total_time_minutes: 20,
        servings: 4,
        created_at: null,
      },
      {
        id: '01094ea6-7a18-4df2-828d-689e7ab055fc',
        title: 'Southern Collard Greens with Smoked Turkey',
        description:
          'A slow-simmered greens dish made with fresh collard greens and smoked turkey cooked in a seasoned broth.',
        skill_level: 2,
        prep_time_minutes: 30,
        cook_time_minutes: 165,
        total_time_minutes: 195,
        servings: 8,
        created_at: null,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: mockRecipes,
          error: null,
        })),
      }),
    });

    const result = await getRecipesByEquipmentName('pot');

    expect(result).toEqual(mockRecipes);
  });

  it('should return an empty array when no recipes match the equipment', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: [],
          error: null,
        })),
      }),
    });

    const result = await getRecipesByEquipmentName(
      'nonexistent equipment',
    );

    expect(result).toEqual([]);
  });

  it('should throw error when database query fails', async () => {
    const mockError = {
      message: 'Network error',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: null,
          error: mockError,
        })),
      }),
    });

    await expect(
      getRecipesByEquipmentName('pot'),
    ).rejects.toThrow('Network error');
  });
});

describe('getRecipesByIngredientName', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (supabase as any).from = jest.fn();
  });

  it('should fetch recipes by ingredient name successfully', async () => {
    const mockRecipes = [
      {
        id: 'e18d2686-6a9e-4759-8fd9-17c6dce1d70a',
        title: 'Corn Strawberry Cucumber Salad',
        description:
          'A fresh composed salad made with steamed corn, cucumber, cherry tomatoes, strawberries, avocado, feta, and basil.',
        skill_level: 1,
        prep_time_minutes: 15,
        cook_time_minutes: 5,
        total_time_minutes: 20,
        servings: 4,
        created_at: null,
      },
      {
        id: '412b75e1-ee08-4be0-b5f8-74904ec866da',
        title: 'Fish Tacos',
        description:
          'Corn tortillas filled with seasoned baked tilapia and topped with cabbage, avocado, onion, cilantro, Cotija cheese, and a creamy lime taco sauce.',
        skill_level: 2,
        prep_time_minutes: 20,
        cook_time_minutes: 25,
        total_time_minutes: 45,
        servings: 8,
        created_at: null,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: mockRecipes,
          error: null,
        })),
      }),
    });

    const result = await getRecipesByIngredientName(
      'avocado',
    );

    expect(result).toEqual(mockRecipes);
  });

  it('should return an empty array when no recipes match the ingredient', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: [],
          error: null,
        })),
      }),
    });

    const result = await getRecipesByIngredientName(
      'nonexistent ingredient',
    );

    expect(result).toEqual([]);
  });

  it('should throw error when database query fails', async () => {
    const mockError = {
      message: 'Network error',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(async () => ({
          data: null,
          error: mockError,
        })),
      }),
    });

    await expect(
      getRecipesByIngredientName('avocado'),
    ).rejects.toThrow('Network error');
  });
});

describe('getRecipesByCookTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (supabase as any).from = jest.fn();
  });

  it('should fetch recipes within the maximum cook time successfully', async () => {
    const mockRecipes = [
      {
        id: 'e18d2686-6a9e-4759-8fd9-17c6dce1d70a',
        title: 'Corn Strawberry Cucumber Salad',
        description:
          'A fresh composed salad made with steamed corn, cucumber, cherry tomatoes, strawberries, avocado, feta, and basil.',
        skill_level: 1,
        prep_time_minutes: 15,
        cook_time_minutes: 5,
        total_time_minutes: 20,
        servings: 4,
        created_at: null,
      },
      {
        id: '6b3d1dfd-12cf-4e8d-b917-2568006b65ee',
        title: 'Garlic Mashed Potatoes',
        description:
          'A classic mashed potato side dish made with boiled potatoes, garlic, butter, and milk.',
        skill_level: 1,
        prep_time_minutes: 15,
        cook_time_minutes: 20,
        total_time_minutes: 35,
        servings: 6,
        created_at: null,
      },
      {
        id: '412b75e1-ee08-4be0-b5f8-74904ec866da',
        title: 'Fish Tacos',
        description:
          'Corn tortillas filled with seasoned baked tilapia and topped with cabbage, avocado, onion, cilantro, Cotija cheese, and a creamy lime taco sauce.',
        skill_level: 2,
        prep_time_minutes: 20,
        cook_time_minutes: 25,
        total_time_minutes: 45,
        servings: 8,
        created_at: null,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        lte: jest.fn().mockImplementation(async () => ({
          data: mockRecipes,
          error: null,
        })),
      }),
    });

    const result = await getRecipesByCookTime(45);

    expect(result).toEqual(mockRecipes);
  });

  it('should return an empty array when no recipes match the cook time', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        lte: jest.fn().mockImplementation(async () => ({
          data: [],
          error: null,
        })),
      }),
    });

    const result = await getRecipesByCookTime(10);

    expect(result).toEqual([]);
  });

  it('should throw error when database query fails', async () => {
    const mockError = {
      message: 'Network error',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        lte: jest.fn().mockImplementation(async () => ({
          data: null,
          error: mockError,
        })),
      }),
    });

    await expect(
      getRecipesByCookTime(45),
    ).rejects.toThrow('Network error');
  });
});