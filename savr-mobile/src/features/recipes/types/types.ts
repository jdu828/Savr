export interface RecipeStep {
  stepNumber: number;
  title: string;
  description: string;
  duration?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  steps: RecipeStep[];
}
