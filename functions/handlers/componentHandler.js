// src/functions/handlers/componentHandler.js
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { DRINK_MENU } from "../../data/drinks.js";
import { showMenu, handlePageTurn } from "./menuHandler.js";

export async function handleComponents(interaction) {
  try {
    if (!interaction.isButton()) return;
    if (interaction.customId.startsWith("adv_")) {
      const targetScene = interaction.customId.replace("adv_", "");
      const userId = interaction.user.id;
      await handleAdventure(interaction, userId, targetScene);
      return;
    }
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferUpdate();
    }

    switch (true) {
      case interaction.customId.startsWith("drink_"):
        await handleDrinkInfo(interaction);
        break;
      case interaction.customId === "mainMenu":
        await handleMainMenu(interaction);
        break;
      case interaction.customId === "menu_prev":
      case interaction.customId === "menu_next":
        await handleMenuNavigation(interaction);
        break;
    }
  } catch (error) {
    console.error("Component Error:", error);
    await handleComponentError(interaction);
  }
}

async function handleMenuNavigation(interaction) {
  const direction = interaction.customId === "menu_prev" ? "prev" : "next";
  await handlePageTurn(interaction, direction);
}

async function handleDrinkInfo(interaction) {
  try {
    // Split on FIRST underscore only
    const [prefix, ...drinkIdParts] = interaction.customId.split("_");
    const rawDrinkId = drinkIdParts.join("_"); // Rejoin remaining parts
    const drinkName = rawDrinkId.replace(/_/g, " ").trim();

    // Debugging logs
    console.log("[DEBUG] Raw drink ID:", rawDrinkId);
    console.log("[DEBUG] Looking up:", drinkName);
    console.log("[DEBUG] Available drinks:", Object.keys(DRINK_MENU));

    // Case-insensitive search
    const drinkKey = Object.keys(DRINK_MENU).find(
      (key) => key.toLowerCase() === drinkName.toLowerCase(),
    );

    if (!drinkKey) {
      console.error("[ERROR] Drink not found:", drinkName);
      return interaction.followUp({
        content: "*static* Drink recipe corrupted... Check console logs",
        ephemeral: true,
      });
    }

    const drink = DRINK_MENU[drinkKey];
    const normalizedDrinkName = drinkKey; // Use original casing from data

    const infoEmbed = new EmbedBuilder()
      .setColor(0x6c5b7b)
      .setTitle(`▰ ${normalizedDrinkName} ▰`)
      .setDescription(`\`\`\`diff\n+ ${drink.effect}\`\`\``)
      .addFields(
        {
          name: "Ingredients",
          value: `\`\`\`fix\n${drink.ingredients.join(" • ") || "Classified"}\`\`\``,
        },
        {
          name: "Price",
          value: `\`\`\`ml\n${drink.price}G\`\`\``,
          inline: true,
        },
        {
          name: "Preparation",
          value: `\`\`\`bash\n${drink.steps.join("\n")}\`\`\``,
        },
      )
      .setImage(drink.image)
      .setFooter({ text: "VA-11 HALL-A © Sukeban Games" });

    const backButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("mainMenu")
        .setLabel("Back to Menu")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🚪"),
    );

    await interaction.editReply({
      embeds: [infoEmbed],
      components: [backButton],
    });
  } catch (error) {
    console.error("[ERROR] Drink info failed:", error);
    await interaction.followUp({
      content: "*glitch* Failed to retrieve recipe...",
      ephemeral: true,
    });
  }
}

async function handleMainMenu(interaction) {
  await showMenu(interaction);
}

async function handleComponentError(interaction) {
  const errorMessage = {
    content: "*glitch sounds* System overload... rebooting",
    ephemeral: true,
  };

  if (interaction.deferred || interaction.replied) {
    await interaction.followUp(errorMessage);
  } else {
    await interaction.reply(errorMessage);
  }
}
