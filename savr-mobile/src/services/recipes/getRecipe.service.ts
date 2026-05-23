import { supabase } from '../../lib/supabase';

export async function getRecipeById(recipeId: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .single();

  if (error) throw new Error(error.message);

  if (!data) throw new Error('Recipe not found');

  console.log('Fetched recipe:', data); // Debug log to check the fetched data
  return data;
}