import { supabase } from '../../lib/supabase';
import { RecipeIngredient, RecipeIngredientRow } from '../../types/ingredient.types';

function mapRowToIngredient(row: RecipeIngredientRow): RecipeIngredient {
    return {
        recipeIngredientId: row.id,
        ingredientId: row.ingredient_id ?? '', // Handle potential null value
        recipeId: row.recipe_id ?? '', // Handle potential null value   
        name: row.ingredients?.[0]?.name ?? '', // Flatten the ingredient name from the joined table
        quantity: row.quantity, 
        unit: row.unit,
        isOptional: row.is_optional,
    };
}

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

    // Convert the raw database rows to the frontend model, flattening the ingredient name
    return (data as RecipeIngredientRow[]).map(mapRowToIngredient);
}