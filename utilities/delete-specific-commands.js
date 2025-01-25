import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const GUILD_ID = "995879199229362227";
const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.DISCORD_TOKEN;
const COMMANDS_TO_DELETE = ['adventure', 'play', 'skip', 'stop']; // Names of commands to remove

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    // Get existing commands
    const existingCommands = await rest.get(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
    );

    // Filter commands to delete
    const commandsToDelete = existingCommands.filter(c => 
      COMMANDS_TO_DELETE.includes(c.name)
    );

    // Delete commands sequentially
    for (const command of commandsToDelete) {
      await rest.delete(
        Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, command.id)
      );
      console.log(`🗑️ Deleted command: ${command.name} (ID: ${command.id})`);
    }

    console.log('✅ Selective deletion complete!');

  } catch (error) {
    console.error('❌ Deletion error:', error);
  }
})();