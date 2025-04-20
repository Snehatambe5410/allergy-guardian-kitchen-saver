
import { SampleRecipe } from "../types";

export const breakfastRecipes: SampleRecipe[] = [
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
  },
  {
    name: "Avocado Toast with Poached Egg",
    description: "A nutritious and trendy breakfast featuring creamy avocado and perfectly poached egg.",
    ingredients: [
      "2 slices of sourdough bread",
      "1 ripe avocado",
      "2 fresh eggs",
      "1 tbsp white vinegar",
      "2 tsp lemon juice",
      "1/4 tsp red pepper flakes",
      "Salt and pepper to taste",
      "1 tbsp fresh chives, chopped",
      "1 tsp extra virgin olive oil"
    ],
    instructions: [
      "Toast the sourdough bread slices until golden and crispy.",
      "Fill a medium pot with water, add vinegar, and bring to a gentle simmer.",
      "Crack each egg into a small cup. Create a gentle whirlpool in the water and carefully slide each egg into the center.",
      "Cook for 3 minutes for a runny yolk, then remove with a slotted spoon onto paper towels.",
      "Meanwhile, mash the avocado with lemon juice, salt, and pepper in a bowl.",
      "Spread the avocado mixture onto the toast slices.",
      "Place a poached egg on each toast slice.",
      "Sprinkle with red pepper flakes, freshly ground black pepper, and chopped chives.",
      "Drizzle with olive oil and serve immediately."
    ],
    allergens: ["Wheat", "Eggs"],
    preparationTime: 15,
    servings: 2,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    source: {
      name: "Bon Appétit",
      url: "https://www.bonappetit.com/recipe/avocado-toast"
    }
  }
];
