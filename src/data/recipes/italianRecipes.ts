
import { SampleRecipe } from "../types";

export const italianRecipes: SampleRecipe[] = [
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
  }
];
