import { supabase } from '../../lib/supabase';
import { RecipeEquipment, RecipeEquipmentRow } from '../../types/equipment.types';

function mapRowToEquipment(row: RecipeEquipmentRow): RecipeEquipment {
  return {
    recipeEquipmentId: row.id,
    recipeId: row.recipe_id ?? '',
    equipmentId: row.equipment_id ?? '',
    quantity: row.quantity ?? 0,
    isOptional: row.is_optional ?? false,
    notes: row.notes ?? '',
    size: row.size ?? '',   
    name: row.equipment?.[0]?.name ?? '',
  };
}

export async function getRecipeEquipment(recipeId: string): Promise<RecipeEquipment[]> {
  const { data, error } = await supabase
    .from('recipe_equipment')
    .select(`
      id,
      recipe_id,
      equipment_id,
      quantity,
      is_optional,
      notes,
      size,
      equipment ( name )
    `)
    .eq('recipe_id', recipeId);

  if (error) throw new Error(error.message);
  if (!data) return [];

  return (data as RecipeEquipmentRow[]).map(mapRowToEquipment);
}
