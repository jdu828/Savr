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