import { supabase } from '../../lib/supabase';
import { Recipe } from '../../types/recipe.types';

/**
 * Service function to fetch a single recipe from DB based on the id
 * @param recipeId The recipe id to directly query the DB with
 * @returns Promise resolving to a single Recipe object
 */
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

/**
 * Service function to fetch recipes from DB based on tag name
 * @param tagName The string name of the tag to query recipes with
 * @returns Promise resolving to an array of recipes
 */
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

/**
 * Service function to fetch recipes from DB based on equipment name
 * @param equipmentName The string name of the equipment to query recipes with
 * @returns Promise resolving to an array of recipes
 */
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

/**
 * Service function to fetch recipes from DB based on ingredient name
 * @param ingredientName The string name of the ingredient to query recipes with
 * @returns Promise resolving to an array of recipes
 */
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

/**
 * Service function to fetch recipes from DB based on max cook time
 * @param maxMinutes max number of minutes a recipe can be
 * @returns Promise resolving to an array of recipes
 */
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

/**
 * Retrieves a random batch of recipes for the discovery feed.
 *get_random_recipes pgsql function:

    create or replace function get_random_recipes(recipe_limit integer)
    returns setof recipes
    language sql
    as $$
      select *
      from recipes
      order by random()
      limit recipe_limit;
    $$;
    
 * @param limit - Maximum number of recipes to retrieve.
 * @returns A random array of recipes.
 */
export async function getRandomRecipes(
  limit: number,
): Promise<Recipe[]> {
  const { data, error } = await supabase.rpc(
    'get_random_recipes', // get_random_recipes is a PostGreSQL custom function
    {
      recipe_limit: limit,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as Recipe[];
}