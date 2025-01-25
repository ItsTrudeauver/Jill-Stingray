// moodHandler.js
import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} from "discord.js";
import { DRINK_MENU } from "../../data/drinks.js";
import { formatCyberpunk } from "../services/formattingService.js";
import { handleGroqRequest } from "../services/personalityService.js";
import config from "../../config.js";

const MOOD_CATEGORIES = {
  neural: {
    label: "Neural Oscillations",
    emoji: "🧠",
    moods: [
      "hyperstatic_restlessness",
      "neural_ferocity",
      "circuit_fever",
      "muscle_memory_rage",
      "caffeine_paranoia",
      "quicksilver_anxiety",
      "hemo_agitation",
      "hops_vertigo",
    ],
  },
  synthetic: {
    label: "Synthetic Emotions",
    emoji: "🤖",
    moods: [
      "synthespian_nostalgia",
      "glitch_glamour",
      "cybernetic_ennui",
      "fata_morgana",
      "polycarbonate_serenity",
      "olive_schadenfreude",
      "zen_overclock",
      "dermal_overdrive",
    ],
  },
  chromatic: {
    label: "Chromatic Distortions",
    emoji: "🌈",
    moods: [
      "lunar_melancholy",
      "cobalt_vertigo",
      "solar_flare_nostalgia",
      "bioluminescent_unease",
      "rhythm_apathy",
      "martian_itch",
      "synthwave_ennui",
      "sugar_coma",
      "aqua_null",
    ],
  },
};

const MOOD_DRINK_MAP = {
  hyperstatic_restlessness: "Sugar Rush",
  dermal_overdrive: "Bad Touch",
  synthespian_nostalgia: "Fluffy Dream",
  lunar_melancholy: "Moonblast",
  hemo_agitation: "Bleeding Jane",
  synthwave_ennui: "Piano Woman",
  cobalt_vertigo: "Cobalt Velvet",
  sugar_coma: "Fringe Weaver",
  neural_ferocity: "Gut Punch",
  martian_itch: "Marsblast",
  quicksilver_anxiety: "Mercuryblast",
  circuit_fever: "Piledriver",
  glitch_glamour: "Sparkle Star",
  solar_flare_nostalgia: "Sunshine Cloud",
  hops_vertigo: "Beer",
  zen_overclock: "Zen Star",
  bioluminescent_unease: "Crevice Spike",
  fata_morgana: "Blue Fairy",
  olive_schadenfreude: "Brandtini",
  caffeine_paranoia: "Bloom Light",
  polycarbonate_serenity: "Flaming Moai",
  muscle_memory_rage: "Suplex",
  aqua_null: "Frothy Water",
  cybernetic_ennui: "Grizzly Temple",
  rhythm_apathy: "Piano Man",
};

export const MoodHandler = {
  async createMoodInterface(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId("moodCategory")
      .setPlaceholder("♫ Select Neural Frequency...")
      .addOptions(
        Object.entries(MOOD_CATEGORIES).map(([value, category]) => ({
          label: category.label,
          value,
          emoji: category.emoji,
          description: `Contains ${category.moods.length} mood signatures`,
        })),
      );

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("Neural Mixology Interface")
      .setDescription(formatCyberpunk("*Jill taps the holographic menu*"))
      .setThumbnail("https://strangerthanaplottwist.com/wp-content/uploads/2019/06/d8dxuakuiamurou.jpg");

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },

  async handleCategorySelection(interaction) {
    const categoryKey = interaction.values[0];
    const category = MOOD_CATEGORIES[categoryKey];

    const menu = new StringSelectMenuBuilder()
      .setCustomId("moodmixer")
      .setPlaceholder(`♫ ${category.label.toUpperCase()} SPECTRUM ♫`)
      .addOptions(
        category.moods.map((mood) => ({
          label: this.formatMoodName(mood),
          value: mood,
          emoji: this.getMoodEmoji(mood),
          description:
            DRINK_MENU[MOOD_DRINK_MAP[mood]]?.effect || "Effect classified",
        })),
      );

    const embed = new EmbedBuilder()
      .setColor(0x4d5e94)
      .setTitle(`${category.emoji} ${category.label}`)
      .setDescription(formatCyberpunk("*Neural scanner initializing...*"));

    await interaction.update({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },

  async handleMoodSelection(interaction) {
    const mood = interaction.values[0];
    const drinkKey = MOOD_DRINK_MAP[mood];
    const drink = DRINK_MENU[MOOD_DRINK_MAP[mood]] || this.getFallbackDrink();

    try {
      const prompt = this.createMoodPrompt(mood, drink);
      const aiResponse = await handleGroqRequest(
        prompt,
        config.MOOD_CONFIG,
        process.env.GROQ_MOOD_KEY,
      );

      const embed = new EmbedBuilder()
        .setColor(0x8a4df3)
        .setTitle(`💠 ${drinkKey}`)
        .setAuthor(
          {
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        }
                  )
        .setImage(drink.image)
        .addFields(
          {
            name: "Effect",
            value: formatCyberpunk(drink.effect),
            inline: true,
          },
          {
            name: "Ingredients",
            value: drink.ingredients.join(" • "),
            inline: true,
          },
          { name: "Jill's Advice", value: formatCyberpunk(aiResponse) },
        )
        .setFooter({ text: "VA-11 HALL-A Neural Mixing System v2.3.1" });

      await interaction.update({
        embeds: [embed],
        components: [],
      });
    } catch (error) {
      console.error("Mood Mix Error:", error);
      await interaction.update({
        content: formatCyberpunk(
          "Neural interface failure... Try another mood?",
        ),
        components: [],
      });
    }
  },

  // Helper methods
  formatMoodName(mood) {
    return mood
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  },

  getMoodEmoji(mood) {
    const emojiMap = {
      hyperstatic_restlessness: "⚡",
      dermal_overdrive: "🔥",
      synthespian_nostalgia: "🎭",
      lunar_melancholy: "🌑",
      hemo_agitation: "💉",
      synthwave_ennui: "🎹",
      cobalt_vertigo: "🌀",
      sugar_coma: "🍬",
      neural_ferocity: "🧠",
      martian_itch: "🧪",
      quicksilver_anxiety: "🌊",
      circuit_fever: "💻",
      glitch_glamour: "💎",
      solar_flare_nostalgia: "🌞",
      hops_vertigo: "🍺",
      zen_overclock: "☯",
      bioluminescent_unease: "🌠",
      fata_morgana: "🌁",
      olive_schadenfreude: "🍸",
      caffeine_paranoia: "☕",
      polycarbonate_serenity: "🏖",
      muscle_memory_rage: "💪",
      aqua_null: "💧",
      cybernetic_ennui: "🤖",
      rhythm_apathy: "🎧",
    };
    return emojiMap[mood] || "❓";
  },

  createMoodPrompt(mood, drink) {
    return `As Jill from VA-11 HALL-A, create drink advice for ${this.formatMoodName(mood)}.
    Ingredients: ${drink.ingredients.join(", ")}
    Effect: ${drink.effect}
    Format: 1-2 sentences, cyberpunk bartender style
    Never mention: undefined, ingredients, or effects directly
    Example: "For that neural static... try a ${drink.name}. ${drink.effect.toLowerCase()}・"`;
  },

  getFallbackDrink() {
    return {
      name: "Glitch Brew",
      ingredients: ["Karmotrine", "Data Fragments"],
      effect: "+7 System Stability",
      image: "https://i.imgur.com/9E2WQ9v.png",
    };
  },
};
