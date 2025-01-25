export default {
  API_ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",
  LLM_MODEL: "llama3-70b-8192",
  DIRECT_RESPONSE_TEMP: 0.65,
  AMBIENT_RESPONSE_TEMP: 0.3,
  AMBIENT_TRIGGERS: {
    strong: ["karmotrine", "tab", "rent", "special"],
    weak: ["drink", "pour", "glass", "order"],
  },
  MAX_RESPONSE_LENGTH: 1024, // Keep below 4096
  ERROR_RESPONSES: ["System glitch・", "Neural static...", "Try again later・"],
  MOOD_CONFIG: {
    ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",
    MODEL: "mixtral-8x7b-32768",
    MAX_TOKENS: 500,
    TEMPERATURE: 0.72,
    MOODS: [
      "hyperstatic_restlessness", // Sugar Rush
      "dermal_overdrive", // Bad Touch
      "synthespian_nostalgia", // Fluffy Dream
      "lunar_melancholy", // Moonblast
      "hemo_agitation", // Bleeding Jane
      "synthwave_ennui", // Piano Woman
      "cobalt_vertigo", // Cobalt Velvet
      "sugar_coma", // Fringe Weaver
      "neural_ferocity", // Gut Punch
      "martian_itch", // Marsblast
      "quicksilver_anxiety", // Mercuryblast
      "circuit_fever", // Piledriver
      "glitch_glamour", // Sparkle Star
      "solar_flare_nostalgia", // Sunshine Cloud
      "hops_vertigo", // Beer
      "zen_overclock", // Zen Star
      "bioluminescent_unease", // Crevice Spike
      "fata_morgana", // Blue Fairy
      "olive_schadenfreude", // Brandtini
      "caffeine_paranoia", // Bloom Light
      "polycarbonate_serenity", // Flaming Moai
      "muscle_memory_rage", // Suplex
      "aqua_null", // Frothy Water
      "cybernetic_ennui", // Grizzly Temple
      "rhythm_apathy", // Piano Man
    ],
  },
  ERROR_RESPONSES: [
    "*ARCNet static* Try again",
    "Jukebox skipped...",
    "Neon flickers・",
  ],
};
