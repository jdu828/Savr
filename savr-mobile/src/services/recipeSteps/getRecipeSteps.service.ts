import { supabase } from '../../lib/supabase';
import { RecipeStep, RecipeStepRow } from '../../types/recipe.types';

function mapRowToStep(row: RecipeStepRow): RecipeStep {
  return {
    stepId: row.id,
    recipeId: row.recipe_id ?? '',
    order: row.step_number ?? 0,
    instruction: row.instruction ?? '',
  };
}

export async function getRecipeSteps(recipeId: string): Promise<RecipeStep[]> {
  const { data, error } = await supabase
    .from('recipe_steps')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('step_number', { ascending: true });

  if (error) throw new Error(error.message);

  if (!data) return [];

  return (data as RecipeStepRow[]).map(mapRowToStep);
}
