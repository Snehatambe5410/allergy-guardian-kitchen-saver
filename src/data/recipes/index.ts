
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from "../../types";
import { SampleRecipe } from "../types";
import { indianRecipes } from "./indianRecipes";
import { italianRecipes } from "./italianRecipes";
import { internationalRecipes } from "./internationalRecipes";
import { breakfastRecipes } from "./breakfastRecipes";

export const sampleRecipes: SampleRecipe[] = [
  ...indianRecipes,
  ...italianRecipes,
  ...internationalRecipes,
  ...breakfastRecipes
];

export const importSampleRecipe = (sampleRecipe: SampleRecipe): Recipe => {
  return {
    ...sampleRecipe,
    id: uuidv4()
  };
};
