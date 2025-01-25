// src/functions/handlers/interactionHandler.js
import { handleDrinkInfo } from "./componentHandler.js";
import { handleMenuCommand } from "./menuHandler.js";

export async function handleComponent(interaction) {
  if (!interaction.isButton()) return;

  switch (true) {
    case interaction.customId.startsWith("drinkInfo_"):
      await handleDrinkInfo(interaction);
      break;

    case interaction.customId === "mainMenu":
      await handleMenuCommand(interaction);
      break;
  }
}
