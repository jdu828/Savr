import { supabase } from '../../lib/supabase';
import { RecipeTag, RecipeTagRow } from '../../types/recipe.types';

function mapRowToTag(row: RecipeTagRow): RecipeTag {
  return {
    recipeTagId: row.id,
    recipeId: row.recipe_id ?? '',
    tagId: row.tag_id ?? '',
    name: row.tags?.[0]?.name ?? '',
    type: row.tags?.[0]?.type ?? 'none',
  };
}

export async function getRecipeTags(recipeId: string): Promise<RecipeTag[]> {
  const { data, error } = await supabase
    .from('recipe_tags')
    .select(`
      recipe_id,
      tag_id,
      tags ( name, type )
    `)
    .eq('recipe_id', recipeId);

  if (error) throw new Error(error.message);
  if (!data) return [];

  return (data as RecipeTagRow[]).map(mapRowToTag);
}
