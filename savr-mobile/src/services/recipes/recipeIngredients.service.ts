import { supabase } from '../../lib/supabase';
import { RecipeIngredient } from '../../types/ingredient.types';

export async function getRecipeIngredients(
    recipeId: string
): Promise<RecipeIngredient[]> {
    const { data, error } = await supabase
        .from('recipe_ingredients')
        .select(`
        id,
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        is_optional,
        ingredients ( 
            name
        )
        `)
        .eq('recipe_id', recipeId);

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        return [];
    }

    return data.map((row: any): RecipeIngredient => ({
        recipeIngredientId: row.id,
        ingredientId: row.ingredient_id,
        recipeId: row.recipe_id,
        name: row.ingredients?.name ?? '', // Flatten the ingredient name from the joined table
        quantity: row.quantity,
        unit: row.unit,
        isOptional: row.is_optional,
    }));
}