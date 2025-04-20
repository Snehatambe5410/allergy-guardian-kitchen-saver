
import { SampleRecipe } from "../types";

export const indianRecipes: SampleRecipe[] = [
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
