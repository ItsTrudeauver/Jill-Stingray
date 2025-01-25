import './keepAlive.js';
import { Client, GatewayIntentBits } from "discord.js";
import { showMenu } from "./functions/handlers/menuHandler.js";
import { mixDrink } from "./functions/handlers/drinkHandler.js";
import { handleComponents } from "./functions/handlers/componentHandler.js";
import { handleDailySpecial } from "./functions/handlers/specialHandler.js";
import { handleMessage } from "./functions/handlers/chatHandler.js";
import { handle8Ball } from "./functions/handlers/eightBallHandler.js";
import {
  handleNeuralScan,
  handleDeepScan,
} from "./functions/handlers/neuralHandler.js";
import { handleHelp } from "./functions/handlers/helpHandler.js";
import { handleWeather } from "./functions/handlers/weatherHandler.js";
import { MoodHandler } from './functions/handlers/moodHandler.js';
import { handleInvite } from "./functions/handlers/inviteHandler.js";
import { handleNeuralDeepScan } from "./functions/handlers/neuralScanHandler.js";

import express from 'express';
const keepAlive = express();
const PORT = 8080;

keepAlive.get('/', (req, res) => {
  res.send('VA-11 HALL-A Bartender Online');
});

keepAlive.listen(PORT, () => {
  console.log(`🖥️  Cybernetic Interface Active: Port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Weather alert setup (optional)
client.on("ready", () => {
  console.log(`〘⚠〙 ${client.user.tag} neural sync complete`);

  // Existing weather alert interval (keep this)
  const weatherInterval = setInterval(() => {
    client.guilds.cache.forEach((guild) => {
      const channel = guild.systemChannel;
      if (channel) {
        channel.send({
          content: "⚠️ **CYBER WEATHER ALERT** ⚠️",
          embeds: [createWeatherAlertEmbed(guild)]
        });
      }
    });
  }, 24 * 60 * 60 * 1000); // 24 hours

  // New White Knight evasion protocol
  const evasionInterval = setInterval(() => {
    fetch('https://your-repl-url.your-username.repl.co')
      .then(() => console.log('〘⚠〙 White Knight radar spoofed'))
      .catch(err => console.log('〘⚠〙 Neural grid interference:', err));
  }, 240000); // 4 minutes

  // Unified shutdown handler
  process.on('SIGINT', () => {
    console.log('〘⚠〙 Initiating controlled shutdown...');
    clearInterval(weatherInterval);
    clearInterval(evasionInterval);
    client.destroy();
    process.exit();
  });

  // Existing status rotation
  const statuses = [
    { type: 'PLAYING', name: 'with Karmotrine' },
    { type: 'WATCHING', name: 'Dana\'s bad decisions' }
  ];

  let statusIndex = 0;
  setInterval(() => {
    client.user.setActivity(statuses[statusIndex]);
    statusIndex = (statusIndex + 1) % statuses.length;
  }, 60000); // Keep existing 1 minute rotation

  console.log(`〘⚠〙 Active protocols: ${client.ws.ping}ms latency`);
});
// Message handling
client.on("messageCreate", async (message) => {
  try {
    await handleMessage(message);
  } catch (error) {
    console.error("Message Handling Error:", error);
  }
});

// Interaction handling (core fix)
client.on("interactionCreate", async (interaction) => {
  try {
    // Handle slash commands
    if (interaction.isCommand()) {
      switch (interaction.commandName) {
        case "menu":
          await showMenu(interaction);
          break;
        case "order":
          await mixDrink(interaction);
          break;
        case "specials":
          await handleDailySpecial(interaction);
          break;
        case "8ball":
          await handle8Ball(interaction);
          break;
        case "diagnose":
          await handleNeuralScan(interaction);
          break;
        case "help":
          await handleHelp(interaction);
          break;
        case "weather":
          await handleWeather(interaction);
          break;
        case "invite":
          await handleInvite(interaction);
          break;
        case "neural-scan":
          await handleNeuralDeepScan(interaction);
          break;
        case "mixmood":  // New command added
          await MoodHandler.createMoodInterface(interaction);
          break;
      }
    }

    // Handle button interactions
    if (interaction.isButton()) {
      // Special case for help pagination
      if (interaction.customId.startsWith("help_")) {
        return handleHelp(interaction);
      }

      // Defer other buttons first
      await interaction.deferUpdate();

      if (interaction.customId === "deep_scan") {
        await handleDeepScan(interaction);
      } else if (interaction.customId.startsWith("choice_")) {
        await AdventureEngine.handleButton(interaction);
      } else {
        await handleComponents(interaction);
      }
    }

    // Handle select menu interactions (New section added)
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'moodCategory') {
        await MoodHandler.handleCategorySelection(interaction);
      }
      if (interaction.customId === 'moodmixer') {
        await MoodHandler.handleMoodSelection(interaction);
      }
    }
  } catch (error) {
    console.error("Interaction Error:", error);
    // Error handling with proper state checks
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "⚠️ System glitch detected... Try again?",
        ephemeral: true,
      });
    } else if (interaction.deferred) {
      await interaction.followUp({
        content: "⚠️ System glitch detected... Try again?",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);