import { useCallback, useEffect, useState } from 'react';

import { getRecipesByTagName } from '../services/recipes/getRecipe.service';
import { Recipe } from '../types/recipe.types';

/**
 * Retrieves recipes associated with a specific tag.
 *
 * Handles loading, error, refresh, and recipe list state for the UI layer.
 */
export function useRecipesByTag(tagName: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    if (!tagName || tagName.trim() === '') {
      setError('Tag name is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getRecipesByTagName(tagName);

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
  }, [tagName]);

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