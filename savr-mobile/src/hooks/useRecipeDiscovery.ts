import { useCallback, useEffect, useState } from 'react';

import { getRandomRecipes } from '../services/recipes/getRecipe.service';
import { Recipe } from '../types/recipe.types';

// Initial discovery batch size is 10
const DISCOVERY_BATCH_SIZE = 10;

/**
 * Retrieves a random batch of recipes for the home discovery feed.
 *
 * The hook is intentionally simple for the MVP.
 * Recommendation and personalization logic will be added later in a separate hook.
 */
export function useRecipeDiscovery() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getRandomRecipes(DISCOVERY_BATCH_SIZE);

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
  }, []);

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