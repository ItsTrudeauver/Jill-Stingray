// functions/handlers/eightBallHandler.js
import { EmbedBuilder } from "discord.js";
import { adjustMood } from "../services/personalityService.js";

const ORACLE_RESPONSES = [
  {
    text: "░░▓▀▄▒▓░░ SYNTAX_OVERFLOW ░░▒▄▀▓░",
    moodEffect: -3,
    color: 0xff5555,
    image: "https://i.imgur.com/GLITCH_ERROR.png",
  },
  {
    text: "Karmotrine reserves: **28%**・ASK AGAIN",
    moodEffect: 0,
    color: 0x00ced1,
    image: "https://i.imgur.com/KARMOTRINE_TANK.jpg",
  },
  {
    text: "Neon signs flicker: █████ YES",
    moodEffect: +2,
    color: 0xff69b4,
    image: "https://i.imgur.com/NEON_SIGNS.gif",
  },
  {
    text: "Dana's note: _‘Check back after 3 drinks’_",
    moodEffect: -1,
    color: 0x6c5b7b,
    image: "https://i.imgur.com/DANA_NOTE.jpg",
  },
  {
    text: "Jukebox says: INSERT COIN FOR ANSWER",
    moodEffect: +1,
    color: 0x32cd32,
    image: "https://i.imgur.com/JUKEBOX_VA11.png",
  },
  {
    text: "Glimmer corruption index: **89%**・UNCLEAR",
    moodEffect: -2,
    color: 0x8a2be2,
    image: "https://i.imgur.com/GLIMMER_CITY.jpg",
  },
  {
    text: "Sugar Rush required for clarity・",
    moodEffect: +3,
    color: 0xff1493,
    image: "https://i.imgur.com/SUGAR_RUSH_DRINK.png",
  },
  {
    text: "White Knights inbound・ANSWER REDACTED",
    moodEffect: -4,
    color: 0xdc143c,
    image: "https://i.imgur.com/WHITE_KNIGHTS.png",
  },
  {
    text: "Outlook: ▒▒▒▒▒▒▒▒▒・DRINK FIRST",
    moodEffect: +1,
    color: 0x7cfc00,
    image: "https://i.imgur.com/COCKTAIL_GLASS.png",
  },
  {
    text: "`ERROR: TRY /order Suplex`・Then ask",
    moodEffect: 0,
    color: 0x9370db,
    image: "https://i.imgur.com/SUPLEX_DRINK.jpg",
  },
];
export async function handle8Ball(interaction) {
  const accuracy = (Math.random() * 100).toFixed(1); // Random 0.0-100.0%
  const question = interaction.options.getString("question");
  const response =
    ORACLE_RESPONSES[Math.floor(Math.random() * ORACLE_RESPONSES.length)];

  adjustMood(response.moodEffect);

  const embed = new EmbedBuilder()
    .setColor(response.color)
    .setTitle("⚡ CYBER ORACLE v0.8b ⚡")
    .setDescription("```fix\n[GLITCH CITY DIVINATION MODULE]\n```")
    .addFields(
      { name: "Question", value: `_${question}_`, inline: false },
      {
        name: "Prediction Matrix",
        value: `**${response.text}**`,
        inline: false,
      },
    )
    .setImage(
      "https://static.wikia.nocookie.net/va11halla/images/b/b2/Glitch_City.png/revision/latest?cb=20161221162706",
    ) // Large main image
    .setThumbnail(
      "https://upload.wikimedia.org/wikipedia/en/8/83/VA-11_HALL-A_logo.png",
    ) // Small consistent thumbnail
    .setFooter({
      text: `Accuracy: ${accuracy}% │ VA-11 HALL-A Divination Unit`,
    })
    .setColor(
      accuracy < 33
        ? 0xff5555 // Red for <33%
        : accuracy < 66
          ? 0xffd700 // Gold for 33-66%
          : 0x32cd32, // Green for 66%+
    );

  await interaction.reply({ embeds: [embed] });
}
