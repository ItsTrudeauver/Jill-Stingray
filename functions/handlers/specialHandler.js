// src/functions/handlers/specialHandler.js
import { EmbedBuilder } from "discord.js";
import {
  DRINK_MENU,
  getDailySpecial,
  DAILY_SPECIAL_DISCOUNT,
} from "../../data/drinks.js";

export async function handleDailySpecial(interaction) {
  const dailyDrink = getDailySpecial();
  const originalPrice = DRINK_MENU[dailyDrink].price;
  const discountPrice = originalPrice * (1 - DAILY_SPECIAL_DISCOUNT);

  const embed = new EmbedBuilder()
    .setColor("#FF69B4")
    .setTitle("✨ Today's Special ✨")
    .setDescription(
      `*${dailyDrink}* - ${discountPrice.toFixed(0)}G (**${DAILY_SPECIAL_DISCOUNT * 100}% off!**)`,
    )
    .addFields(
      { name: "Regular Price", value: `${originalPrice}G`, inline: true },
      { name: "Effect", value: DRINK_MENU[dailyDrink].effect, inline: true },
    )
    .setImage(DRINK_MENU[dailyDrink].image)
    .setFooter({ text: "Special changes daily at midnight UTC" });

  await interaction.reply({ embeds: [embed] });
}
