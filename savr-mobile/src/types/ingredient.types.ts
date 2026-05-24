import { Tables } from './database';

// The frontend model for a recipe ingredient
export type RecipeIngredient = {
  recipeIngredientId: string;
  ingredientId: string;
  recipeId: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  isOptional: boolean | null;
};

// Exact representation of the query output from 
// the getRecipeIngredients function, including the joined ingredient name
export type RecipeIngredientRow = {
    id: string;
    recipe_id: string | null;
    ingredient_id: string | null;
    quantity: number | null;
    unit: string | null;
    is_optional: boolean | null;
    ingredients: {
        name: string;
    }[];
};