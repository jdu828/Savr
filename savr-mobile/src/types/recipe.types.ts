
// DB row type (snake_case) for recipe steps
export type RecipeStepRow = {
  id: string;
  recipe_id: string | null;
  step_number: number | null;
  instruction: string | null;
};

// Frontend model (camelCase)
export type RecipeStep = {
  stepId: string;
  recipeId: string;
  order: number;
  instruction: string;
};

export type RecipeTagRow = {
  id: string;
  recipe_id: string | null;
  tag_id: string | null;
  tags: { name: string }[] | null;
};

export type RecipeTag = {
  recipeTagId: string;
  recipeId: string;
  tagId: string;
  name: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string | null;
  skill_level: number;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  total_time_minutes: number | null;
  servings: number | null;
  created_at: string;
};