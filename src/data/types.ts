
import { Recipe } from "../types";

export interface RecipeSource {
  name: string;
  url: string;
}

export interface SampleRecipe extends Omit<Recipe, 'id'> {
  source: RecipeSource;
}

export type CuisineType = 'Indian' | 'Italian' | 'American' | 'International';
