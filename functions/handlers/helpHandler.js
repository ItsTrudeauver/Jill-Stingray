import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { commands } from "../../utilities/deploy-commands.js";

const COMMANDS_PER_PAGE = 6;
const CYBERPUNK_RED = "#FF003C";
const JILL_AVATAR =
  "https://avatarfiles.alphacoders.com/277/thumb-1920-277821.png";
const NEURAL_BG = "https://i.redd.it/cw16hqmf0hw01.png";
const STATE_TIMEOUT = 300000; // 5 minutes

// Encrypted state storage
const userStates = new Map();

function getPageState(userId) {
  const state = userStates.get(userId);
  if (state) {
    clearTimeout(state.timeout);
    state.timeout = setTimeout(() => userStates.delete(userId), STATE_TIMEOUT);
    return state.pageState;
  }
  return {
    currentPage: 1,
    totalPages: Math.ceil(commands.length / COMMANDS_PER_PAGE),
  };
}

function chunkCommands(page) {
  const start = (page - 1) * COMMANDS_PER_PAGE;
  return commands.slice(start, start + COMMANDS_PER_PAGE);
}

function createNavigationButtons(currentPage, totalPages) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("help_previous")
      .setLabel("◄ DATA BACKPORT")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(currentPage === 1),
    new ButtonBuilder()
      .setCustomId("help_next")
      .setLabel("NEXTPORT ►")
      .setStyle(ButtonStyle.Success)
      .setDisabled(currentPage === totalPages),
  );
}

function createEmbed(pageState) {
  return new EmbedBuilder()
    .setColor(CYBERPUNK_RED)
    .setTitle(
      `**NEURAL INTERFACE v2.3.5 [PAGE ${pageState.currentPage}/${pageState.totalPages}]**`,
    )
    .setDescription("```ACCESS GRANTED: JILL-OS CORE SYSTEMS```\n")
    .setThumbnail(JILL_AVATAR)
    .setImage(NEURAL_BG)
    .addFields(
      chunkCommands(pageState.currentPage).map((cmd) => ({
        name: `⌨️ /${cmd.name}`,
        value: `▸ ${cmd.description}\n\u200B`,
        inline: true,
      })),
    )
    .setFooter({
      text: `Jill Stingray OS © 2077 Glitch City Systems | Page ${pageState.currentPage} of ${pageState.totalPages}`,
      iconURL: JILL_AVATAR,
    });
}

export async function handleHelp(interaction) {
  // Handle neural interface buttons
  if (interaction.isButton()) {
    try {
      const userId = interaction.user.id;
      const pageState = getPageState(userId);

      // Update neural paging
      pageState.currentPage =
        interaction.customId === "help_previous"
          ? Math.max(1, pageState.currentPage - 1)
          : Math.min(pageState.totalPages, pageState.currentPage + 1);

      // Store state with fresh encryption
      userStates.set(userId, {
        pageState,
        timeout: setTimeout(() => userStates.delete(userId), STATE_TIMEOUT),
      });

      // Update neural display
      await interaction.update({
        embeds: [createEmbed(pageState)],
        components: [
          createNavigationButtons(pageState.currentPage, pageState.totalPages),
        ],
      });
    } catch (error) {
      console.error("Neural Interface Error:", error);
      // Don't attempt to respond to invalid interactions
    }
    return;
  }

  // Initialize neural interface
  try {
    await interaction.deferReply({ ephemeral: false });

    const userId = interaction.user.id;
    const pageState = {
      currentPage: 1,
      totalPages: Math.ceil(commands.length / COMMANDS_PER_PAGE),
    };

    // Encrypt new state
    userStates.set(userId, {
      pageState,
      timeout: setTimeout(() => userStates.delete(userId), STATE_TIMEOUT),
    });

    // Build neural components
    const components = [];
    if (pageState.totalPages > 1) {
      components.push(createNavigationButtons(1, pageState.totalPages));
    }

    // Transmit interface
    await interaction.editReply({
      embeds: [createEmbed(pageState)],
      components,
    });
  } catch (error) {
    console.error("Neural Interface Failure:", error);
    await interaction.followUp({
      content: "⚠️ Cybernetic overload... Reboot interface・",
      ephemeral: false,
    });
  }
}
