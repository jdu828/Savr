import { useCallback, useEffect, useState } from 'react';

import { getRecipesByIngredientName } from '../services/recipes/getRecipe.service';
import { Recipe } from '../types/recipe.types';

/**
 * Retrieves recipes containing a specific ingredient.
 *
 * Handles loading, error, refresh, and recipe list state for the UI layer.
 */
export function useRecipesByIngredient(ingredientName: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    if (!ingredientName || ingredientName.trim() === '') {
      setError('Ingredient name is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getRecipesByIngredientName(ingredientName);

      setRecipes(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [ingredientName]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    refresh: fetchRecipes,
  };
}