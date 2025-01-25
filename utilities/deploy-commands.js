import { REST, Routes } from "discord.js";
import { DRINK_MENU } from "../data/drinks.js";
import "dotenv/config";

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_IDS = [
  "995879199229362227", // Primary test server
  "588261753100566528"  // Secondary server
];
const TOKEN = process.env.DISCORD_TOKEN;

export const commands = [
  {
    name: "menu",
    description: "View the drink menu",
  },
  {
    name: "order",
    description: "Order a cyberpunk cocktail",
    options: [
      {
        type: 3, // STRING
        name: "drink",
        description: "Choose your poison",
        required: true,
        choices: Object.keys(DRINK_MENU).map((drink) => ({
          name: drink,
          value: drink,
        })),
      },
    ],
  },
  {
    name: "8ball",
    description: "Cyberpunk fortune telling",
    options: [
      {
        type: 3, // STRING
        name: "question",
        description: "Your neon-lit inquiry",
        required: true,
      },
    ],
  },
  {
    name: "specials",
    description: "Today's special discount!",
  },
  {
    name: "diagnose",
    description: "Run neural interface diagnostics",
  },
  {
    name: "help",
    description: "Display neural interface help menu",
  },
  {
    name: 'weather',
    description: 'Check current cyber weather conditions',
    options: [{
      name: 'refresh',
      type: 5, // BOOLEAN
      description: 'Force refresh weather scan (Admin)'
    }]
  },
  {
      name: 'invite',
      description: 'Get neural sync link for this unit',
  },
  {
    name: 'neural-scan',
    description: 'Perform advanced neural diagnostics'
  },
  {
    name: 'mixmood',
    description: 'Prescribe neurochemical cocktails',
    options: [{
      name: 'intensity',
      type: 4, // INTEGER
      description: 'Emotional amplitude (1-5)',
      choices: [1,2,3,4,5].map(n => ({ 
        name: `Level ${n}`, 
        value: n 
      }))
    }]
  }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function deploy() {
  try {
    console.log(`Initializing deployment of ${commands.length} cybernetic commands...`);

    const deploymentResults = await Promise.all(
      GUILD_IDS.map(guildId => 
        rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, guildId),
          { body: commands }
        )
        .then(data => ({
          success: true,
          guildId,
          count: data.length
        }))
        .catch(error => ({
          success: false,
          guildId,
          error
        }))
      )
    );

    // Display results
    deploymentResults.forEach(result => {
      if(result.success) {
        console.log(`🟢 Successfully deployed ${result.count} commands to server ${result.guildId}`);
      } else {
        console.error(`🔴 Failed deployment to ${result.guildId}:`, result.error);
      }
    });

    console.log('Neural command sync complete');
  } catch (error) {
    console.error("Critical deployment failure:", error);
  }
}

deploy();