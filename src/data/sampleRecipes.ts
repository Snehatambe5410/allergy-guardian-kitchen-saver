
import { Recipe } from "../types";
import { v4 as uuidv4 } from 'uuid';

export interface RecipeSource {
  name: string;
  url: string;
}

export interface SampleRecipe extends Omit<Recipe, 'id'> {
  source: RecipeSource;
}

export const sampleRecipes: SampleRecipe[] = [
  {
    name: "Classic Margherita Pizza",
    description: "A simple, classic Italian pizza with fresh ingredients.",
    ingredients: [
      "2 1/4 cups (280g) all-purpose flour",
      "1 tsp salt",
      "1 tsp instant yeast",
      "3/4 cup (180ml) warm water",
      "1 tbsp olive oil",
      "1 cup tomato sauce",
      "8 oz fresh mozzarella, sliced",
      "Fresh basil leaves",
      "2 tbsp extra virgin olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "In a large bowl, combine flour, salt, and yeast.",
      "Add warm water and olive oil, mix until a shaggy dough forms.",
      "Knead the dough for about 5 minutes until smooth and elastic.",
      "Place in an oiled bowl, cover, and let rise for 1-2 hours until doubled.",
      "Preheat oven to 500°F (260°C) with a pizza stone if available.",
      "Stretch dough into a 12-inch circle on parchment paper.",
      "Spread tomato sauce over the dough, leaving a 1/2-inch border.",
      "Arrange mozzarella slices over the sauce.",
      "Bake for 8-10 minutes until crust is golden and cheese is bubbling.",
      "Remove from oven, top with fresh basil, drizzle with olive oil, and season with salt and pepper."
    ],
    allergens: ["Wheat", "Milk"],
    preparationTime: 140,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
    source: {
      name: "Sally's Baking Addiction",
      url: "https://sallysbakingaddiction.com/homemade-pizza-dough-recipe/"
    }
  },
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
    name: "One-Pot Pasta Primavera",
    description: "A simple, flavorful pasta dish with fresh spring vegetables.",
    ingredients: [
      "8 oz (225g) fettuccine or linguine pasta",
      "1 cup cherry tomatoes, halved",
      "1 zucchini, thinly sliced",
      "1 yellow squash, thinly sliced",
      "1 bell pepper, thinly sliced",
      "1/2 red onion, thinly sliced",
      "3 cloves garlic, minced",
      "2 tbsp olive oil",
      "1 tsp dried Italian herbs",
      "4 cups vegetable broth",
      "1/2 cup grated Parmesan cheese",
      "1/4 cup fresh basil, chopped",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)"
    ],
    instructions: [
      "In a large pot, combine pasta, all vegetables, garlic, olive oil, and dried herbs.",
      "Pour vegetable broth over everything and bring to a boil.",
      "Reduce heat to medium and cook for 9-11 minutes, stirring occasionally.",
      "When pasta is al dente and most of the liquid has been absorbed, remove from heat.",
      "Stir in Parmesan cheese and half of the basil.",
      "Season with salt and pepper to taste.",
      "Serve topped with remaining fresh basil and red pepper flakes if desired."
    ],
    allergens: ["Wheat", "Milk"],
    preparationTime: 20,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    source: {
      name: "Budget Bytes",
      url: "https://www.budgetbytes.com/one-pot-pasta-primavera/"
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
  },
  {
    name: "Berry Breakfast Smoothie Bowl",
    description: "A nutritious, customizable breakfast bowl packed with berries and toppings.",
    ingredients: [
      "1 cup mixed frozen berries (strawberries, blueberries, raspberries)",
      "1 frozen banana",
      "1/2 cup Greek yogurt",
      "1/4 cup milk of choice",
      "1 tbsp honey or maple syrup (optional)",
      "Toppings: fresh berries, sliced banana, granola, chia seeds, coconut flakes, nut butter"
    ],
    instructions: [
      "Add frozen berries, banana, yogurt, milk, and sweetener to a blender.",
      "Blend until smooth but still thick (should be thicker than a drinkable smoothie).",
      "Pour into a bowl and arrange toppings in sections on top of the smoothie base.",
      "Enjoy immediately with a spoon."
    ],
    allergens: ["Milk", "Tree nuts (optional in toppings)"],
    preparationTime: 10,
    servings: 1,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1501746877-14782df58970",
    source: {
      name: "Minimalist Baker",
      url: "https://minimalistbaker.com/berry-smoothie-bowl/"
    }
  }
];

export const importSampleRecipe = (sampleRecipe: SampleRecipe): Recipe => {
  return {
    ...sampleRecipe,
    id: uuidv4()
  };
};
