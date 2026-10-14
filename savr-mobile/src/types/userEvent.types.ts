import type { Json } from './database';

export type InventoryEventRow = {
  id: string;
  user_inventory: string;
  event_type: string | null;
  quantity_delta: number | null;
  created_at: string | null;
};

export type InventoryEvent = {
  eventId: string;
  userInventoryId: string;
  eventType: string | null;
  quantityDelta: number | null;
  createdAt: string | null;
};

export type SavedRecipeRow = {
  user_id: string;
  recipe_id: string;
  created_at: string | null;
};

export type SavedRecipe = {
  userId: string;
  recipeId: string;
  createdAt: string | null;
};


export type UserRecipeActionRow = {
  id: string;
  user_id: string;
  recipe_id: string | null;
  action_type: string | null;
  source: string | null;
  metadata: Json | null;
  created_at: string | null;
};

export type UserRecipeAction = {
  actionId: string;
  userId: string;
  recipeId: string | null;
  actionType: string | null;
  source: string | null;
  metadata: Json | null;
  createdAt: string | null;
};