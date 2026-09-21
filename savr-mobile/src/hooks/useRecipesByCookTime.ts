import { useCallback, useEffect, useState } from 'react';

import { getRecipesByCookTime } from '../services/recipes/getRecipe.service';
import { Recipe } from '../types/recipe.types';

/**
 * Retrieves recipes whose total cooking time is within the given limit.
 *
 * Handles loading, error, refresh, and recipe list state for the UI layer.
 */
export function useRecipesByCookTime(maxMinutes: number) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    if (maxMinutes <= 0) {
      setError('Maximum cook time must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getRecipesByCookTime(maxMinutes);

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
  }, [maxMinutes]);

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