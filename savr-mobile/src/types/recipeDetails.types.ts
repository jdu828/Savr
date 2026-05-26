import { Recipe, RecipeStep, RecipeTag } from './recipe.types';
import { RecipeIngredient } from './ingredient.types';
import { RecipeEquipment } from './equipment.types';

/**
 * Composite type representing all recipe-related data assembled for the frontend.
 * This is the return type of getRecipeDetails service.
 * 
 * @property recipe - The main recipe details
 * @property ingredients - List of ingredients used in the recipe
 * @property steps - Ordered list of cooking steps
 * @property equipment - List of equipment/tools needed
 * @property tags - List of tags/categories for the recipe
 */
export type RecipeDetails = {
  recipe: Recipe;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  equipment: RecipeEquipment[];
  tags: RecipeTag[];
};
