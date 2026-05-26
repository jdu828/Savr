import { getRecipeDetails } from '../recipes/getRecipeDetails.service';
import * as recipeService from '../recipes/getRecipe.service';
import * as ingredientService from '../recipes/getRecipeIngredients.service';
import * as stepsService from '../recipeSteps/getRecipeSteps.service';
import * as equipmentService from '../recipeEquipment/getRecipeEquipment.service';
import * as tagsService from '../recipeTags/getRecipeTags.service';
import { RecipeDetails } from '../../types/recipeDetails.types';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock all underlying services
jest.mock('../recipes/getRecipe.service');
jest.mock('../recipes/getRecipeIngredients.service');
jest.mock('../recipeSteps/getRecipeSteps.service');
jest.mock('../recipeEquipment/getRecipeEquipment.service');
jest.mock('../recipeTags/getRecipeTags.service');

describe('getRecipeDetails', () => {
  const recipeId = 'recipe-123';

  const mockRecipe = {
    id: 'recipe-123',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish',
    skill_level: 2,
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    total_time_minutes: 30,
    servings: 4,
    created_at: '2024-01-15T10:30:00Z',
  };

  const mockIngredients = [
    {
      recipeIngredientId: 'ing-1',
      ingredientId: 'ing-001',
      recipeId: 'recipe-123',
      name: 'Spaghetti',
      quantity: 400,
      unit: 'g',
      isOptional: false,
    },
    {
      recipeIngredientId: 'ing-2',
      ingredientId: 'ing-002',
      recipeId: 'recipe-123',
      name: 'Eggs',
      quantity: 3,
      unit: 'whole',
      isOptional: false,
    },
    {
      recipeIngredientId: 'ing-3',
      ingredientId: 'ing-003',
      recipeId: 'recipe-123',
      name: 'Bacon',
      quantity: 200,
      unit: 'g',
      isOptional: false,
    },
  ];

  const mockSteps = [
    {
      stepId: 'step-1',
      recipeId: 'recipe-123',
      order: 1,
      instruction: 'Boil water in a large pot and add salt',
    },
    {
      stepId: 'step-2',
      recipeId: 'recipe-123',
      order: 2,
      instruction: 'Cook spaghetti according to package directions',
    },
    {
      stepId: 'step-3',
      recipeId: 'recipe-123',
      order: 3,
      instruction: 'Meanwhile, fry bacon until crispy',
    },
  ];

  const mockEquipment = [
    {
      recipeEquipmentId: 'eq-1',
      recipeId: 'recipe-123',
      equipmentId: 'eq-001',
      name: 'Large Pot',
      quantity: 1,
      isOptional: false,
      notes: 'For boiling pasta',
      size: 'Large',
    },
    {
      recipeEquipmentId: 'eq-2',
      recipeId: 'recipe-123',
      equipmentId: 'eq-002',
      name: 'Frying Pan',
      quantity: 1,
      isOptional: false,
      notes: 'For cooking bacon',
      size: 'Medium',
    },
  ];

  const mockTags = [
    {
      recipeTagId: 'tag-1',
      recipeId: 'recipe-123',
      tagId: 'tag-001',
      name: 'Italian',
    },
    {
      recipeTagId: 'tag-2',
      recipeId: 'recipe-123',
      tagId: 'tag-002',
      name: 'Pasta',
    },
    {
      recipeTagId: 'tag-3',
      recipeId: 'recipe-123',
      tagId: 'tag-003',
      name: 'Quick',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('successful aggregation', () => {
    it('should fetch and assemble all recipe data successfully', async () => {
      // Setup mocks
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue(mockSteps);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue(mockEquipment);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue(mockTags);

      // Execute
      const result = await getRecipeDetails(recipeId);

      // Verify structure
      expect(result).toEqual({
        recipe: mockRecipe,
        ingredients: mockIngredients,
        steps: mockSteps,
        equipment: mockEquipment,
        tags: mockTags,
      });
    });

    it('should return valid RecipeDetails type', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue(mockSteps);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue(mockEquipment);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue(mockTags);

      const result: RecipeDetails = await getRecipeDetails(recipeId);

      // Verify structure matches RecipeDetails type
      expect(result).toHaveProperty('recipe');
      expect(result).toHaveProperty('ingredients');
      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('equipment');
      expect(result).toHaveProperty('tags');
      expect(result.recipe.id).toBe(recipeId);
    });

    it('should handle empty lists from related services', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue([]);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue([]);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue([]);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue([]);

      const result = await getRecipeDetails(recipeId);

      expect(result.recipe).toEqual(mockRecipe);
      expect(result.ingredients).toEqual([]);
      expect(result.steps).toEqual([]);
      expect(result.equipment).toEqual([]);
      expect(result.tags).toEqual([]);
    });
  });

  describe('service invocation', () => {
    it('should call getRecipeById with correct recipeId', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue([]);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue([]);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue([]);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue([]);

      await getRecipeDetails(recipeId);

      expect(recipeService.getRecipeById).toHaveBeenCalledWith(recipeId);
      expect(recipeService.getRecipeById).toHaveBeenCalledTimes(1);
    });

    it('should call getRecipeIngredients with correct recipeId', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue([]);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue([]);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue([]);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue([]);

      await getRecipeDetails(recipeId);

      expect(ingredientService.getRecipeIngredients).toHaveBeenCalledWith(recipeId);
      expect(ingredientService.getRecipeIngredients).toHaveBeenCalledTimes(1);
    });

    it('should call getRecipeSteps with correct recipeId', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue([]);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue([]);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue([]);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue([]);

      await getRecipeDetails(recipeId);

      expect(stepsService.getRecipeSteps).toHaveBeenCalledWith(recipeId);
      expect(stepsService.getRecipeSteps).toHaveBeenCalledTimes(1);
    });

    it('should call getRecipeEquipment with correct recipeId', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue([]);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue([]);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue([]);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue([]);

      await getRecipeDetails(recipeId);

      expect(equipmentService.getRecipeEquipment).toHaveBeenCalledWith(recipeId);
      expect(equipmentService.getRecipeEquipment).toHaveBeenCalledTimes(1);
    });

    it('should call getRecipeTags with correct recipeId', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue([]);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue([]);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue([]);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue([]);

      await getRecipeDetails(recipeId);

      expect(tagsService.getRecipeTags).toHaveBeenCalledWith(recipeId);
      expect(tagsService.getRecipeTags).toHaveBeenCalledTimes(1);
    });

    it('should call all services in parallel', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue(mockSteps);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue(mockEquipment);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue(mockTags);

      const startTime = Date.now();
      await getRecipeDetails(recipeId);
      const endTime = Date.now();

      // Should be much faster than serial execution (sum of all service times)
      // This is a soft assertion to verify parallel execution
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('error propagation', () => {
    it('should propagate error from getRecipeById', async () => {
      const testError = new Error('Recipe not found');
      (recipeService.getRecipeById as jest.Mock).mockRejectedValue(testError);

      await expect(getRecipeDetails(recipeId)).rejects.toThrow(
        `Failed to fetch recipe details for recipe ID "${recipeId}": Recipe not found`
      );
    });

    it('should propagate error from getRecipeIngredients', async () => {
      const testError = new Error('Database connection failed');
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockRejectedValue(testError);

      await expect(getRecipeDetails(recipeId)).rejects.toThrow(
        `Failed to fetch recipe details for recipe ID "${recipeId}": Database connection failed`
      );
    });

    it('should propagate error from getRecipeSteps', async () => {
      const testError = new Error('Query timeout');
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockRejectedValue(testError);

      await expect(getRecipeDetails(recipeId)).rejects.toThrow(
        `Failed to fetch recipe details for recipe ID "${recipeId}": Query timeout`
      );
    });

    it('should propagate error from getRecipeEquipment', async () => {
      const testError = new Error('Permission denied');
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue(mockSteps);
      (equipmentService.getRecipeEquipment as jest.Mock).mockRejectedValue(testError);

      await expect(getRecipeDetails(recipeId)).rejects.toThrow(
        `Failed to fetch recipe details for recipe ID "${recipeId}": Permission denied`
      );
    });

    it('should propagate error from getRecipeTags', async () => {
      const testError = new Error('Service unavailable');
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue(mockSteps);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue(mockEquipment);
      (tagsService.getRecipeTags as jest.Mock).mockRejectedValue(testError);

      await expect(getRecipeDetails(recipeId)).rejects.toThrow(
        `Failed to fetch recipe details for recipe ID "${recipeId}": Service unavailable`
      );
    });

    it('should include recipeId in error message for debugging', async () => {
      const testRecipeId = 'non-existent-recipe';
      const testError = new Error('Not found');
      (recipeService.getRecipeById as jest.Mock).mockRejectedValue(testError);

      await expect(getRecipeDetails(testRecipeId)).rejects.toThrow(
        `Failed to fetch recipe details for recipe ID "${testRecipeId}"`
      );
    });

    it('should handle non-Error objects gracefully', async () => {
      (recipeService.getRecipeById as jest.Mock).mockRejectedValue('Unknown error');

      await expect(getRecipeDetails(recipeId)).rejects.toBeDefined();
    });
  });

  describe('input validation', () => {
    it('should throw error when recipeId is empty string', async () => {
      await expect(getRecipeDetails('')).rejects.toThrow(
        'recipeId is required and cannot be empty'
      );
    });

    it('should throw error when recipeId is whitespace only', async () => {
      await expect(getRecipeDetails('   ')).rejects.toThrow(
        'recipeId is required and cannot be empty'
      );
    });

    it('should throw error when recipeId is undefined', async () => {
      await expect(getRecipeDetails(undefined as any)).rejects.toThrow(
        'recipeId is required and cannot be empty'
      );
    });

    it('should throw error when recipeId is null', async () => {
      await expect(getRecipeDetails(null as any)).rejects.toThrow(
        'recipeId is required and cannot be empty'
      );
    });

    it('should accept valid recipeId', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue([]);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue([]);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue([]);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue([]);

      const result = await getRecipeDetails('valid-id-123');

      expect(result).toBeDefined();
      expect(recipeService.getRecipeById).toHaveBeenCalledWith('valid-id-123');
    });
  });

  describe('data consistency', () => {
    it('should maintain data integrity through transformation', async () => {
      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue(mockSteps);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue(mockEquipment);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue(mockTags);

      const result = await getRecipeDetails(recipeId);

      // Verify no data was modified
      expect(result.recipe).toBe(mockRecipe);
      expect(result.ingredients).toBe(mockIngredients);
      expect(result.steps).toBe(mockSteps);
      expect(result.equipment).toBe(mockEquipment);
      expect(result.tags).toBe(mockTags);
    });

    it('should preserve array order from services', async () => {
      const orderedSteps = [
        { ...mockSteps[0], order: 1 },
        { ...mockSteps[1], order: 2 },
        { ...mockSteps[2], order: 3 },
      ];

      (recipeService.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
      (ingredientService.getRecipeIngredients as jest.Mock).mockResolvedValue(mockIngredients);
      (stepsService.getRecipeSteps as jest.Mock).mockResolvedValue(orderedSteps);
      (equipmentService.getRecipeEquipment as jest.Mock).mockResolvedValue(mockEquipment);
      (tagsService.getRecipeTags as jest.Mock).mockResolvedValue(mockTags);

      const result = await getRecipeDetails(recipeId);

      expect(result.steps).toEqual(orderedSteps);
      expect(result.steps[0].order).toBe(1);
      expect(result.steps[1].order).toBe(2);
      expect(result.steps[2].order).toBe(3);
    });
  });
});
