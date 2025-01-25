// drinks.js
export const DRINKS_PER_PAGE = 5;
export const DAILY_SPECIAL_DISCOUNT = 0.2;

export function getDailySpecial() {
  const today = new Date();
  const seed = Number(
    `${today.getFullYear()}${today.getMonth()}${today.getDate()}`,
  );
  const drinks = Object.keys(DRINK_MENU);
  const shuffled = [...drinks].sort(() => Math.sin(seed) - 0.5);
  return shuffled[0];
}

export const DRINK_MENU = {
  "Sugar Rush": {
    price: 80,
    ingredients: ["PwrRush", "Cream", "Strawberry"],
    effect: "+3 Energy, -2 Sanity",
    moodEffect: -3,
    image:  "https://static.wikia.nocookie.net/va11halla/images/1/12/SugarRush.png/revision/latest?cb=20170601170359",
    steps: ["Shaking energy drink...", "Adding synth-strawberry..."],
  },
  "Bad Touch": {
    price: 120,
    ingredients: ["Gin", "Black Lilium", "Xehal Flakes"],
    effect: "+5 Confidence, -3 Filter",
    moodEffect: +2,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/b/b5/Bad_Touch.png/revision/latest?cb=20170612231336",
    steps: ["Crushing Xehal...", "Layering syrup..."],
  },
  "Fluffy Dream": {
    price: 150,
    ingredients: ["Karmotrine", "Milk", "Love"],
    effect: "+10 Nostalgia",
    moodEffect: +7,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/d/d6/Fluffy_Dream.png/revision/latest?cb=20170601154917",
    steps: ["Steaming milk...", "Whisking..."],
  },
  Moonblast: {
    price: 200,
    ingredients: ["Vodka", "Blue Curacao", "Lemon"],
    effect: "+7 Clarity",
    moodEffect: -2,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/6/63/Moonblast.png/revision/latest?cb=20170601162401",
    steps: ["Moon ice...", "Layering..."],
  },
  "Bleeding Jane": {
    price: 180,
    ingredients: ["Rum", "Tomato", "Tabasco"],
    effect: "+8 Grit",
    moodEffect: +4,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/4/47/Bleeding_Jane.png/revision/latest?cb=20170601155146",
    steps: ["Muddling...", "Spicy mix..."],
  },
  "Piano Woman": {
    price: 220,
    ingredients: ["Tequila", "Grapefruit", "Honey"],
    effect: "+9 Creativity",
    moodEffect: +6,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/c/c1/Piano_Woman.png/revision/latest?cb=20170601164155",
    steps: ["Salt rim...", "Citrus press..."],
  },
  "Cobalt Velvet": {
    price: 160,
    ingredients: ["Rum", "Blueberry", "Lime"],
    effect: "+4 Charisma",
    moodEffect: +3,
    image:
"https://static.wikia.nocookie.net/va11halla/images/6/6d/Cobalt_Velvet.png/revision/latest?cb=20170601155151",
    steps: ["Muddling berries...", "Shaking..."],
  },
  "Fringe Weaver": {
    price: 90,
    ingredients: ["Gin", "Sugar", "Lemon"],
    effect: "+6 Optimism",
    moodEffect: +1,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/d/d9/Fringe_Weaver.png/revision/latest?cb=20170601155940",
    steps: ["Sugar rim...", "Twist..."],
  },
  "Gut Punch": {
    price: 250,
    ingredients: ["Whiskey", "Molasses", "Bitters"],
    effect: "+12 Resilience",
    moodEffect: +5,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/e/e6/GutPunch.png/revision/latest?cb=20170601160122",
    steps: ["Stirring...", "Coal garnish..."],
  },
  Marsblast: {
    price: 210,
    ingredients: ["Vodka", "Tomato", "Worcestershire"],
    effect: "+8 Stamina",
    moodEffect: -1,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/2/29/Marsblast.png/revision/latest?cb=20170601161112",
    steps: ["Spicy rim...", "Vigorous shake..."],
  },
  Mercuryblast: {
    price: 230,
    ingredients: ["Tequila", "Lime", "Salt"],
    effect: "+7 Reflexes",
    moodEffect: +2,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/f/f9/Mercuryblast.png/revision/latest?cb=20210615212147",
    steps: ["Salt rim...", "Quick shake..."],
  },
  Piledriver: {
    price: 190,
    ingredients: ["Bourbon", "Ginger", "Lemon"],
    effect: "+9 Focus",
    moodEffect: +4,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/8/8c/Pile_driver.png/revision/latest?cb=20170601164945",
    steps: ["Muddling...", "Building..."],
  },
  "Sparkle Star": {
    price: 280,
    ingredients: ["Champagne", "Gold Flakes", "Elderflower"],
    effect: "+15 Glamour",
    moodEffect: +8,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/b/b9/SparkleStar.png/revision/latest?cb=20170601170951",
    steps: ["Twist...", "Floating flakes..."],
  },
  "Sunshine Cloud": {
    price: 170,
    ingredients: ["Prosecco", "Peach", "Mint"],
    effect: "+8 Joy",
    moodEffect: +5,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/4/42/SunshineCloud.png/revision/latest?cb=20170601170113",
    steps: ["Muddling peach...", "Topping..."],
  },
  Beer: {
    price: 40,
    ingredients: ["Beer"],
    effect: "+5 Boldness",
    moodEffect: -4,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/b/b3/Beer.png/revision/latest?cb=20170601155040",
    steps: ["Pouring...", "Foam whisking..."],
  },
  "Zen Star": {
    price: 240,
    ingredients: ["Sake", "Cucumber", "Mint"],
    effect: "+10 Calm",
    moodEffect: +6,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/4/43/Zen_Star.png/revision/latest?cb=20170601154525",
    steps: ["Muddling...", "Chilling..."],
  },
  "Crevice Spike": {
    price: 270,
    ingredients: ["Mezcal", "Pineapple", "Chili"],
    effect: "+9 Adventure",
    moodEffect: +3,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/c/cf/CreviceSpike.png/revision/latest?cb=20170601155540",
    steps: ["Charring...", "Spicy rim..."],
  },
  "Blue Fairy": {
    price: 200,
    ingredients: ["Blue Curaçao", "Rum", "Lime"],
    effect: "+7 Whimsy",
    moodEffect: +4,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/6/62/BlueFairy.png/revision/latest?cb=20170601154835",
    steps: ["Layering...", "Glitter..."],
  },
  Brandtini: {
    price: 220,
    ingredients: ["Gin", "Vermouth", "Olive"],
    effect: "+6 Sophistication",
    moodEffect: +5,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/0/03/Brandtini.png/revision/latest?cb=20170113072806",
    steps: ["Stirring...", "Olive skewer..."],
  },
  "Bloom Light": {
    price: 180,
    ingredients: ["Whiskey", "Coffee", "Cream"],
    effect: "+8 Alertness",
    moodEffect: +2,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/7/7f/BloomLight.png/revision/latest?cb=20170601154648",
    steps: ["Brewing...", "Floating cream..."],
  },
  "Flaming Moai": {
    price: 160,
    ingredients: ["Coconut Rum", "Pineapple", "Whiskey"],
    effect: "+9 Serenity",
    moodEffect: +3,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/7/7f/FlamingMoai.png/revision/latest?cb=20170601155534",
    steps: ["Blending...", "Umbrella..."],
  },
  Suplex: {
    price: 290,
    ingredients: ["Bourbon", "Honey", "Lemon"],
    effect: "+10 Strength",
    moodEffect: +10,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/8/89/Suplex.png/revision/latest?cb=20170601170252",
    steps: ["Muddling...", "Hard shake..."],
  },
  "Frothy Water": {
    price: 150,
    ingredients: ["Sparkling Water", "Mint", "Lime Zest"],
    effect: "+5 Refreshment",
    moodEffect: +5,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/b/b3/Beer.png/revision/latest?cb=20170601155040",
    steps: ["Chill glass...", "Light stir..."],
  },
  "Grizzly Temple": {
    price: 320,
    ingredients: ["Gin", "Elderflower Liqueur", "Lime Juice", "Cucumber"],
    effect: "+15 Stamina",
    moodEffect: +8,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/d/df/GrizzlyTemple.png/revision/latest?cb=20170601153820",
    steps: ["Shake vigorously...", "Double strain...", "Garnish with basil"],
  },
  "Piano Man": {
    price: 240,
    ingredients: ["Rye Whiskey", "Sweet Vermouth", "Orange Bitters"],
    effect: "+8 Charisma",
    moodEffect: +6,
    image:
      "https://static.wikia.nocookie.net/va11halla/images/8/8d/Piano_Man.png/revision/latest?cb=20170601162912",
    steps: [
      "Stir with ice...",
      "Strain into rocks glass...",
      "Express orange peel",
    ],
  },
};
