import { getRecipeDetails } from '../services/recipes/getRecipeDetails.service';
import { useState, useEffect, useCallback } from 'react';
import { RecipeDetails } from '../types/recipeDetails.types';

/**
 * Hook to get all the details (recipe info, ingredients, steps, equipment, tags)
 * into one singular RecipeDetails object
 * RecipeDetails Object contains .recipe/.ingredients/.steps/.equipment/.tags array fields
 * @param recipeId The ID of the recipe you wish to query
 * @returns RecipeDetails object containing all recipe info
 */
export function useRecipeDetails(recipeId: string) {
    const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecipeDetails = useCallback(async () => {
        if(!recipeId || recipeId.trim() === '') {
            setError('Recipe ID is required');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const data = await getRecipeDetails(recipeId);
            setRecipeDetails(data);
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
        fetchRecipeDetails();
    }, [fetchRecipeDetails]);

    return { recipeDetails, loading, error, refresh: fetchRecipeDetails };
}