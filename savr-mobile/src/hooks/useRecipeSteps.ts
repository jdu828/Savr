import { useState } from 'react';

import { getRecipeSteps } from '../services/recipeSteps/getRecipeSteps.service';
import { RecipeStep } from '../types/recipe.types';

interface UseRecipeStepsResult {
  steps: RecipeStep[];
  loading: boolean;
  error: Error | null;
  loadSteps: () => Promise<RecipeStep[]>;
}

export function useRecipeSteps(
  recipeId: string,
): UseRecipeStepsResult {
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadSteps = async (): Promise<RecipeStep[]> => {
    if (steps.length > 0) {
      return steps;
    }

    try {
      setLoading(true);
      setError(null);

      const recipeSteps = await getRecipeSteps(recipeId);

      console.log('recipeSteps received by hook:', recipeSteps);
      setSteps(recipeSteps);

      return recipeSteps;
    } catch (err) {
      const fetchError =
        err instanceof Error
          ? err
          : new Error('Failed to fetch recipe steps');

      setError(fetchError);

      throw fetchError;
    } finally {
      setLoading(false);
    }
  };

  return {
    steps,
    loading,
    error,
    loadSteps,
  };
}