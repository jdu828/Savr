import { supabase } from '../../lib/supabase';

export async function getIngredientById(ingredientId: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('id', ingredientId)
    .single();

  if (error) throw new Error(error.message);

  if (!data) throw new Error('Ingredient not found');

  return data;
}