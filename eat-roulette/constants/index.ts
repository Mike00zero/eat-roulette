export const FOODS = [
    "Steak",     // top-right
    "Fast Food",    // right
    "Chicken",  // bottom-right
    "Taco",     // bottom
    "Chinese",// bottom-left
    "Sushi",    // left
    "Burger",   // top-left
    "Pizza",    // top
];

export const foodTypeMap = {
    Pizza: ["pizza_restaurant"],
    Burger: ["hamburger_restaurant"],
    Taco: ["mexican_restaurant"],
    Sushi: ["sushi_restaurant", "japanese_restaurant"],
    Chinese: ["chinese_restaurant"],
    Steak: ["steak_house"],
    Sandwich: ["sandwich_shop"],
    Chicken: ["chicken_restaurant", "fast_food_restaurant"],
};

export const priceLevelMap = {
    'PRICE_LEVEL_INEXPENSIVE': '$',
    'PRICE_LEVEL_MODERATE': '$$',
    'PRICE_LEVEL_EXPENSIVE': '$$$',
    'PRICE_LEVEL_VERY_EXPENSIVE': '$$$$',
}