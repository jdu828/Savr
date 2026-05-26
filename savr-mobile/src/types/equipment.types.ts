
// DB row type for joined recipe_equipment -> equipment
export type RecipeEquipmentRow = {
  id: string;
  recipe_id: string | null;
  equipment_id: string | null;
  quantity: number | null;
  is_optional: boolean | null;
  notes: string | null;
  size: string | null;
  equipment: { 
    name: string }[] 
    | null;
};

export type RecipeEquipment = {
  recipeEquipmentId: string;
  recipeId: string;
  equipmentId: string;
  quantity: number;
  isOptional: boolean;
  notes: string;
  size: string;
  name: string;
};