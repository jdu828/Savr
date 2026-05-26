import { supabase } from '../../lib/supabase';
import { Ingredient } from '../../types/ingredient.types';

export async function getIngredientById(ingredientId: string): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('id', ingredientId)
    .single();

  if (error) throw new Error(error.message);

  if (!data) throw new Error('Ingredient not found');

  return data;
}