import { getRecipeById } from './getRecipe.service';
import { getRecipeIngredients } from './getRecipeIngredients.service';
import { getRecipeSteps } from '../recipeSteps/getRecipeSteps.service';
import { getRecipeEquipment } from '../recipeEquipment/getRecipeEquipment.service';
import { getRecipeTags } from '../recipeTags/getRecipeTags.service';
import { RecipeDetails } from '../../types/recipeDetails.types';

/**
 * Fetches comprehensive recipe details by composing multiple services.
 * 
 * This service orchestrates independent recipe-related services to provide
 * a complete, frontend-ready object containing all recipe data (base recipe info,
 * ingredients, steps, equipment, and tags) in a single call.
 * 
 * Uses Promise.all for efficient parallel execution of independent services.
 * 
 * @param recipeId - The unique identifier of the recipe to fetch
 * @returns Promise resolving to a RecipeDetails object containing all recipe data
 * @throws Error if any underlying service fails or recipe is not found
 * 
 * @example
 * ```typescript
 * const recipeDetails = await getRecipeDetails('recipe-123');
 * console.log(recipeDetails.recipe.title);
 * console.log(recipeDetails.ingredients.length);
 * ```
 */
export async function getRecipeDetails(recipeId: string): Promise<RecipeDetails> {
  if (!recipeId || recipeId.trim() === '') {
    throw new Error('recipeId is required and cannot be empty');
  }

  try {
    // Fetch recipe base data and all related data in parallel
    const [recipe, ingredients, steps, equipment, tags] = await Promise.all([
      getRecipeById(recipeId),
      getRecipeIngredients(recipeId),
      getRecipeSteps(recipeId),
      getRecipeEquipment(recipeId),
      getRecipeTags(recipeId),
    ]);

    return {
      recipe,
      ingredients,
      steps,
      equipment,
      tags,
    };
  } catch (error) {
    // Re-throw with context about which recipe failed
    if (error instanceof Error) {
      throw new Error(`Failed to fetch recipe details for recipe ID "${recipeId}": ${error.message}`);
    }
    throw error;
  }
}
