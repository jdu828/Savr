export type RecipeIngredient = {
  recipeIngredientId: string;
  ingredientId: string;
  recipeId: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  isOptional: boolean | null;
};