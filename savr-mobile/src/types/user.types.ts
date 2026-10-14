// Taken from Supabase schema
export type UserRow = {
  id: string;
  username: string;
  created_at: string;
};

// Frontend model 
export type User = {
  userId: string;
  username: string;
  createdAt: string;
};

export type UserPreferencesRow = {
  id: string;
  user_id: string;
  max_cook_time_minutes: number | null;
  spice_tolerance: number | null;
  dietary_preferences: string | null;
  dislikes: string | null;
  created_at: string | null;
  updated_at: string | null;
  skill_level: number | null;
};

export type UserPreferences = {
  preferencesId: string;
  userId: string;
  maxCookTimeMinutes: number | null;
  spiceTolerance: number | null;
  dietaryPreferences: string | null;
  dislikes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  skillLevel: number | null;
};

export type UserInventoryRow = {
  id: string;
  user_id: string;
  ingredient_id: string | null;
  quantity: number | null;
  unit: string | null;
  acquired_at: string | null;
  expires_at: string | null;
  source: string | null;
  created_at: string | null;
};

export type UserInventory = {
  inventoryId: string;
  userId: string;
  ingredientId: string | null;
  quantity: number | null;
  unit: string | null;
  acquiredAt: string | null;
  expiresAt: string | null;
  source: string | null;
  createdAt: string | null;
};

export type UserEquipmentRow = {
  id: string;
  user_id: string;
  equipment_id: string | null;
  notes: string | null;
  created_at: string | null;
};

export type UserEquipment = {
  userEquipmentId: string;
  userId: string;
  equipmentId: string | null;
  notes: string | null;
  createdAt: string | null;
};