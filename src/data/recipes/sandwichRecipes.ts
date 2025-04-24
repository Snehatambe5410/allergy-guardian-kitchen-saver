
import { SampleRecipe } from "../types";

export const sandwichRecipes: SampleRecipe[] = [
  {
    name: "Classic Club Sandwich",
    description: "Triple-decker sandwich with turkey, bacon, lettuce, and tomato",
    ingredients: [
      "3 slices toasted bread",
      "4 slices turkey breast",
      "4 slices bacon, cooked",
      "2 lettuce leaves",
      "2 tomato slices",
      "2 tbsp mayonnaise",
      "1 avocado, sliced (optional)"
    ],
    instructions: [
      "Toast the bread slices until golden brown",
      "Spread mayonnaise on each slice of bread",
      "Layer lettuce, turkey, bacon, tomato on first slice",
      "Add second slice of bread",
      "Repeat layers",
      "Top with final bread slice",
      "Cut diagonally and serve"
    ],
    allergens: ["gluten", "eggs"],
    preparationTime: 15,
    servings: 1,
    isFavorite: false,
    cuisineType: "American",
    mealType: "Lunch",
    difficulty: "easy",
    source: {
      name: "Allergy Guardian",
      url: "https://allergyguardian.com"
    }
  },
  {
    name: "Vegetarian Mediterranean Sandwich",
    description: "Healthy Mediterranean-style sandwich with hummus and vegetables",
    ingredients: [
      "2 slices whole grain bread",
      "1/4 cup hummus",
      "1 cucumber, sliced",
      "1 tomato, sliced",
      "1/4 red onion, thinly sliced",
      "Handful of spinach leaves",
      "2 tbsp olive tapenade"
    ],
    instructions: [
      "Spread hummus on both slices of bread",
      "Layer cucumber, tomato, red onion, and spinach",
      "Add olive tapenade",
      "Close sandwich and slice diagonally"
    ],
    allergens: ["gluten", "sesame"],
    preparationTime: 10,
    servings: 1,
    isFavorite: false,
    cuisineType: "Mediterranean",
    mealType: "Lunch",
    difficulty: "easy",
    source: {
      name: "Allergy Guardian",
      url: "https://allergyguardian.com"
    }
  }
];
