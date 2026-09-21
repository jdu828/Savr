import { useCallback, useEffect, useState } from 'react';

import { getRecipeById } from '../services/recipes/getRecipe.service';
import { Recipe } from '../types/recipe.types';

/**
 * Retrieves a single recipe by its ID.
 *
 * Handles loading, error, refresh, and recipe state for the UI layer.
 */
export function useRecipe(recipeId: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async () => {
    if (!recipeId || recipeId.trim() === '') {
      setError('Recipe ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getRecipeById(recipeId);

      setRecipe(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  return {
    recipe,
    loading,
    error,
    refresh: fetchRecipe,
  };
}