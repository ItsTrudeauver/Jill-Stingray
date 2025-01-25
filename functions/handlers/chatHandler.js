import { handleCooldown, isOnCooldown } from "../utils/cooldownManager.js";
import { checkCasualCooldown, setCasualCooldown } from "../utils/casualCooldownManager.js";
import { shouldRespondTo } from "../utils/triggerDetector.js";
import { generateJillResponse } from "../services/responseService.js";
import { handleCasualResponse } from "./casualHandler.js";
import { EmbedBuilder } from "discord.js";
import { DRINK_MENU } from "../../data/drinks.js";

export async function handleMessage(message) {
  try {
    if (message.author.bot) return;

    // Casual drop-in system (5% chance, separate cooldown)
    if (!checkCasualCooldown(message.author.id) && Math.random() < 0.00005) {
      try {
        await message.channel.sendTyping();
        const response = await handleCasualResponse(message.content);

        setCasualCooldown(message.author.id); // 20-60 min cooldown

        // 40% chance to attach random drink embed
        const drinkEmbed = Math.random() < 0.4 ? [createDrinkEmbed()] : [];

        await message.reply({
          content: response,
          embeds: drinkEmbed
        });
        return; // Skip normal handling
      } catch (error) {
        console.error("Casual response error:", error);
        await message.reply("*GLITCH_STATIC* 『システムエラー』");
      }
    }

    // Existing chatbot functionality (15s cooldown)
    if (isOnCooldown(message.author.id)) return;

    const { shouldReply, replyStyle } = shouldRespondTo(message);
    if (!shouldReply) return;

    await message.channel.sendTyping();
    const response = await generateJillResponse(
      message.author.id,
      message.content,
      replyStyle
    );

    handleCooldown(message.author.id);
    await message.reply(response);
  } catch (error) {
    console.error("Handler Error:", error);
    await message.reply("⚠️ Critical system error... Try again later?");
  }
}

function createDrinkEmbed() {
  const drinks = Object.values(DRINK_MENU);
  const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];

  return new EmbedBuilder()
    .setColor('#FF00FF')
    .setTitle(randomDrink.name)
    .setDescription(`⚡ ${randomDrink.effect}`)
    .addFields(
      { name: 'Ingredients', value: randomDrink.ingredients.join(', ') },
      { name: 'Price', value: `${randomDrink.price}Ⓨ`, inline: true }
    )
    .setImage(randomDrink.image);
}