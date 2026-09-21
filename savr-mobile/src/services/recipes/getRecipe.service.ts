import { supabase } from '../../lib/supabase';
import { Recipe } from '../../types/recipe.types';

export async function getRecipeById(recipeId: string) : Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .single();

  if (error) throw new Error(error.message);

  if (!data) throw new Error('Recipe not found');
  return data;
}

export async function getRecipesByTagName(
  tagName: string,
): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_tags!inner (
        tags!inner (
          name
        )
      )
    `)
    .eq('recipe_tags.tags.name', tagName);

  if (error) {
    throw new Error(error.message);
  }

  return data as Recipe[];
}

export async function getRecipesByEquipmentName(
  equipmentName: string,
): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_equipment!inner (
        equipment!inner (
          name
        )
      )
    `)
    .eq(
      'recipe_equipment.equipment.name',
      equipmentName,
    );

  if (error) {
    throw new Error(error.message);
  }

  return data as Recipe[];
}

export async function getRecipesByIngredientName(
  ingredientName: string,
): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients!inner (
        ingredients!inner (
          name
        )
      )
    `)
    .eq(
      'recipe_ingredients.ingredients.name',
      ingredientName,
    );

  if (error) {
    throw new Error(error.message);
  }

  return data as Recipe[];
}

export async function getRecipesByCookTime(
  maxMinutes: number,
): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .lte(
      'total_time_minutes',
      maxMinutes,
    );

  if (error) {
    throw new Error(error.message);
  }

  return data as Recipe[];
}