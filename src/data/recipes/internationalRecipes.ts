
import { SampleRecipe } from "../types";

export const internationalRecipes: SampleRecipe[] = [
  {
    name: "Vegetable Stir-Fry",
    description: "A quick, healthy vegetable stir-fry with a savory sauce.",
    ingredients: [
      "1 tbsp vegetable oil",
      "2 cloves garlic, minced",
      "1 tbsp ginger, grated",
      "1 bell pepper, sliced",
      "1 carrot, julienned",
      "1 cup broccoli florets",
      "1 cup snap peas",
      "1/2 cup sliced mushrooms",
      "2 tbsp soy sauce",
      "1 tbsp rice vinegar",
      "1 tsp sesame oil",
      "1 tsp honey or maple syrup",
      "1/2 tsp red pepper flakes (optional)",
      "2 green onions, sliced",
      "1 tbsp sesame seeds"
    ],
    instructions: [
      "Prepare all vegetables before starting to cook.",
      "In a small bowl, mix soy sauce, rice vinegar, sesame oil, and honey/maple syrup.",
      "Heat vegetable oil in a large wok or skillet over high heat.",
      "Add garlic and ginger, stir for 30 seconds until fragrant.",
      "Add vegetables in order of cooking time: carrots first, then bell peppers, broccoli, and snap peas.",
      "Stir-fry for 3-4 minutes until vegetables begin to soften but remain crisp.",
      "Add mushrooms and stir-fry for another 1-2 minutes.",
      "Pour sauce over vegetables and toss to coat evenly.",
      "Cook for another minute until sauce slightly thickens.",
      "Remove from heat, garnish with green onions and sesame seeds."
    ],
    allergens: ["Soy", "Sesame"],
    preparationTime: 25,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    source: {
      name: "Cookie and Kate",
      url: "https://cookieandkate.com/vegetable-stir-fry-recipe/"
    }
  },
  {
    name: "Homemade Butternut Squash Soup",
    description: "A creamy, comforting soup perfect for cold weather.",
    ingredients: [
      "1 large butternut squash (about 3 lbs), peeled, seeded, and cubed",
      "1 tbsp olive oil",
      "1 onion, chopped",
      "2 carrots, chopped",
      "2 stalks celery, chopped",
      "2 cloves garlic, minced",
      "1 tbsp fresh ginger, grated",
      "4 cups vegetable broth",
      "1/2 tsp ground nutmeg",
      "1/4 tsp cinnamon",
      "1/2 cup coconut milk",
      "Salt and pepper to taste",
      "Toasted pumpkin seeds for garnish",
      "Fresh herbs (sage or thyme) for garnish"
    ],
    instructions: [
      "Heat olive oil in a large pot over medium heat.",
      "Add onion, carrots, and celery. Sauté for 5 minutes until softened.",
      "Add garlic and ginger, cook for another minute until fragrant.",
      "Add butternut squash cubes, vegetable broth, nutmeg, and cinnamon.",
      "Bring to a boil, then reduce heat and simmer for 20-25 minutes until squash is tender.",
      "Using an immersion blender, blend the soup until smooth (or transfer in batches to a regular blender).",
      "Stir in coconut milk and warm through. Season with salt and pepper.",
      "Serve topped with toasted pumpkin seeds and fresh herbs."
    ],
    allergens: ["Tree nuts (coconut)"],
    preparationTime: 45,
    servings: 6,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
    source: {
      name: "Love and Lemons",
      url: "https://www.loveandlemons.com/butternut-squash-soup/"
    }
  }
];
