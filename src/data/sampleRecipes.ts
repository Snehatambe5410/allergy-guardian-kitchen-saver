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
  },
  {
    name: "Chicken Tikka Masala",
    description: "A popular Indian dish featuring tender chicken in a rich, aromatic tomato-based sauce.",
    ingredients: [
      "1.5 lbs chicken breast, cut into 1-inch cubes",
      "1 cup plain yogurt",
      "2 tbsp lemon juice",
      "2 tsp ground cumin",
      "2 tsp ground coriander",
      "2 tsp paprika",
      "1 tsp turmeric",
      "1 tsp ginger paste",
      "2 tsp garlic paste",
      "1 tsp garam masala",
      "2 tbsp oil",
      "1 large onion, finely chopped",
      "2 tbsp butter",
      "1 can (14 oz) tomato sauce",
      "1 cup heavy cream",
      "1/4 cup fresh cilantro, chopped",
      "Salt to taste"
    ],
    instructions: [
      "In a bowl, mix yogurt, lemon juice, cumin, coriander, paprika, turmeric, ginger paste, garlic paste, and 1/2 tsp garam masala.",
      "Add chicken to the marinade, mix well, cover and refrigerate for at least 1 hour (preferably overnight).",
      "Heat oil in a large pan over medium-high heat. Add marinated chicken and cook until browned, about 5-6 minutes. Remove and set aside.",
      "In the same pan, add butter and onions. Sauté until onions are soft and translucent.",
      "Add tomato sauce and simmer for 10-15 minutes until sauce thickens.",
      "Reduce heat to low, add heavy cream and stir well. Return chicken to the pan.",
      "Simmer for another 10 minutes until chicken is fully cooked and sauce is thick.",
      "Stir in remaining garam masala and salt to taste.",
      "Garnish with fresh cilantro before serving."
    ],
    allergens: ["Milk"],
    preparationTime: 135,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
    source: {
      name: "Café Delites",
      url: "https://cafedelites.com/chicken-tikka-masala/"
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
  },
  {
    name: "Black Bean Quinoa Bowl",
    description: "A protein-packed vegetarian bowl with southwestern flavors.",
    ingredients: [
      "1 cup quinoa, rinsed",
      "2 cups vegetable broth",
      "1 can (15 oz) black beans, drained and rinsed",
      "1 cup corn kernels (fresh or frozen)",
      "1 red bell pepper, diced",
      "1/2 red onion, finely diced",
      "1 avocado, diced",
      "1 jalapeño, seeded and minced (optional)",
      "1/4 cup fresh cilantro, chopped",
      "2 tbsp lime juice",
      "2 tbsp olive oil",
      "1 tsp ground cumin",
      "1/2 tsp chili powder",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook quinoa in vegetable broth according to package instructions. Let cool slightly.",
      "In a large bowl, combine cooked quinoa, black beans, corn, bell pepper, red onion, and jalapeño if using.",
      "In a small bowl, whisk together lime juice, olive oil, cumin, chili powder, salt, and pepper.",
      "Pour dressing over quinoa mixture and toss to combine.",
      "Gently fold in diced avocado and cilantro.",
      "Serve warm or cold."
    ],
    allergens: [],
    preparationTime: 25,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6",
    source: {
      name: "Cookie and Kate",
      url: "https://cookieandkate.com/southwestern-quinoa-bowl-recipe/"
    }
  },
  {
    name: "Lemon Garlic Butter Salmon",
    description: "Tender salmon fillets cooked in a rich lemon garlic butter sauce.",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "4 tbsp unsalted butter",
      "4 cloves garlic, minced",
      "2 tbsp fresh lemon juice",
      "1 tsp lemon zest",
      "2 tbsp fresh parsley, chopped",
      "1/2 tsp dried oregano",
      "Salt and pepper to taste",
      "Lemon slices for garnish"
    ],
    instructions: [
      "Pat salmon fillets dry with paper towels and season with salt and pepper.",
      "In a large skillet over medium-high heat, melt 2 tablespoons of butter.",
      "Add salmon fillets skin-side down and cook for 5 minutes.",
      "Flip salmon and cook for another 2 minutes, then remove to a plate.",
      "In the same skillet, add remaining butter, garlic, lemon juice, and lemon zest.",
      "Cook for 2 minutes until garlic is fragrant but not brown.",
      "Stir in parsley and oregano.",
      "Return salmon to the skillet, spoon sauce over fillets and cook for 1 more minute.",
      "Garnish with lemon slices and additional parsley if desired.",
      "Serve immediately."
    ],
    allergens: ["Fish", "Milk"],
    preparationTime: 20,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    source: {
      name: "Epicurious",
      url: "https://www.epicurious.com/recipes/food/views/salmon-with-lemon-butter-sauce"
    }
  },
  {
    name: "Classic Beef Lasagna",
    description: "A hearty Italian casserole with layers of pasta, rich meat sauce, and cheeses.",
    ingredients: [
      "12 lasagna noodles",
      "1 lb ground beef",
      "1 onion, finely chopped",
      "3 cloves garlic, minced",
      "2 cans (15 oz each) tomato sauce",
      "1 can (6 oz) tomato paste",
      "2 tsp dried basil",
      "2 tsp dried oregano",
      "1 tsp salt",
      "1/2 tsp black pepper",
      "15 oz ricotta cheese",
      "1 egg, beaten",
      "1/4 cup fresh parsley, chopped",
      "3 cups shredded mozzarella cheese",
      "1 cup grated Parmesan cheese",
      "2 tbsp olive oil"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Cook lasagna noodles according to package directions; drain and set aside.",
      "In a large skillet, heat olive oil over medium heat. Add onion and cook until soft.",
      "Add garlic and cook for 30 seconds until fragrant.",
      "Add ground beef and cook until browned. Drain excess fat.",
      "Stir in tomato sauce, tomato paste, basil, oregano, salt, and pepper.",
      "Simmer for 20 minutes, stirring occasionally.",
      "In a bowl, combine ricotta cheese, egg, and parsley.",
      "In a 9x13 inch baking dish, spread 1/2 cup of meat sauce.",
      "Layer 3 noodles, 1/3 of the ricotta mixture, 1/3 of the mozzarella, and 1/4 of the parmesan.",
      "Repeat layers twice, ending with noodles, remaining meat sauce, and remaining cheeses.",
      "Cover with foil and bake for 25 minutes.",
      "Remove foil and bake for another 25 minutes until cheese is golden and bubbly.",
      "Let stand for 15 minutes before serving."
    ],
    allergens: ["Wheat", "Eggs", "Milk"],
    preparationTime: 90,
    servings: 8,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1619895092538-128341789043",
    source: {
      name: "Allrecipes",
      url: "https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/"
    }
  },
  {
    name: "Butter Chicken (Murgh Makhani)",
    description: "Tender chicken in a rich, creamy tomato-based sauce - a classic Indian favorite.",
    ingredients: [
      "1.5 lbs chicken thighs, boneless",
      "1 cup plain yogurt",
      "2 tbsp ginger-garlic paste",
      "2 tsp garam masala",
      "2 tsp red chili powder",
      "2 cups tomato puree",
      "1 cup heavy cream",
      "2 tbsp butter",
      "1 tsp kasoori methi (dried fenugreek leaves)",
      "Salt to taste"
    ],
    instructions: [
      "Marinate chicken in yogurt, ginger-garlic paste, and spices for 4 hours",
      "Grill or cook chicken until done",
      "In a pan, cook tomato puree until oil separates",
      "Add cream, butter, and kasoori methi",
      "Simmer with chicken until thick"
    ],
    allergens: ["Milk"],
    preparationTime: 60,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    source: {
      name: "Indian Food Forever",
      url: "https://indianfoodforever.com/butter-chicken-recipe"
    }
  },
  {
    name: "Palak Paneer",
    description: "Fresh spinach curry with cubes of soft paneer cheese.",
    ingredients: [
      "500g spinach, blanched and pureed",
      "200g paneer, cubed",
      "2 onions, finely chopped",
      "2 tomatoes, pureed",
      "3 cloves garlic",
      "1 inch ginger",
      "2 green chilies",
      "1 tsp cumin seeds",
      "1/2 cup cream",
      "Spices (garam masala, turmeric)"
    ],
    instructions: [
      "Blanch and puree spinach",
      "Sauté cumin seeds, garlic, ginger, and onions",
      "Add tomato puree and spices",
      "Mix in spinach puree and simmer",
      "Add paneer cubes and cream",
      "Cook until heated through"
    ],
    allergens: ["Milk"],
    preparationTime: 45,
    servings: 4,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b",
    source: {
      name: "Indian Food Forever",
      url: "https://indianfoodforever.com/palak-paneer-recipe"
    }
  },
  {
    name: "Dal Makhani",
    description: "Creamy black lentils slow-cooked with butter and spices.",
    ingredients: [
      "1 cup black lentils (urad dal)",
      "1/4 cup red kidney beans",
      "2 tbsp butter",
      "1 onion, finely chopped",
      "2 tomatoes, pureed",
      "2 tbsp cream",
      "Spices (garam masala, cumin)",
      "Salt to taste"
    ],
    instructions: [
      "Soak lentils and beans overnight",
      "Pressure cook until soft",
      "Sauté onions and spices in butter",
      "Add tomato puree and simmer",
      "Mix with lentils and cream",
      "Slow cook for rich texture"
    ],
    allergens: ["Milk"],
    preparationTime: 120,
    servings: 6,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    source: {
      name: "Indian Food Forever",
      url: "https://indianfoodforever.com/dal-makhani-recipe"
    }
  },
  {
    name: "Vegetable Biryani",
    description: "Aromatic rice dish with mixed vegetables and authentic spices.",
    ingredients: [
      "2 cups basmati rice",
      "Mixed vegetables (carrots, peas, potatoes)",
      "2 onions, sliced",
      "2 tomatoes, chopped",
      "Biryani spice mix",
      "Saffron strands",
      "Ghee",
      "Fresh mint and coriander"
    ],
    instructions: [
      "Soak rice for 30 minutes",
      "Prepare biryani masala",
      "Layer rice and vegetables",
      "Add saffron milk",
      "Dum cook (steam) for 20 minutes"
    ],
    allergens: ["Milk"],
    preparationTime: 75,
    servings: 6,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
    source: {
      name: "Indian Food Forever",
      url: "https://indianfoodforever.com/vegetable-biryani-recipe"
    }
  }
];

export const importSampleRecipe = (sampleRecipe: SampleRecipe): Recipe => {
  return {
    ...sampleRecipe,
    id: uuidv4()
  };
};
