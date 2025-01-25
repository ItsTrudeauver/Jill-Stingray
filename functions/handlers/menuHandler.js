// src/functions/handlers/menuHandler.js
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import {
  DRINK_MENU,
  DRINKS_PER_PAGE,
  getDailySpecial,
  DAILY_SPECIAL_DISCOUNT,
} from "../../data/drinks.js";

const currentPage = new Map();
const BOX_TOP = "╭───────────────────────────────╮";
const BOX_MID = "│                               │";
const BOX_BOTTOM = "╰───────────────────────────────╯";

export async function showMenu(interaction) {
  try {
    const userId = interaction.user.id;
    const page = currentPage.get(userId) || 0;
    const drinks = Object.entries(DRINK_MENU);
    const maxPage = Math.ceil(drinks.length / DRINKS_PER_PAGE) - 1;

    // Create boxed menu items
    const menuItems = drinks
      .slice(page * DRINKS_PER_PAGE, (page + 1) * DRINKS_PER_PAGE)
      .map(([name, details]) => {
        const formattedName = `▰ ${name.padEnd(24)} ▰`;
        const priceBar = ` ${details.price}G ${"▬".repeat(20)}`;
        return `${BOX_TOP}\n${BOX_MID.replace(" ", formattedName)}\n${BOX_MID.replace(" ", priceBar)}\n${BOX_BOTTOM}`;
      })
      .join("\n");
    const dailySpecial = getDailySpecial();
    const discountPrice =
      DRINK_MENU[dailySpecial].price * (1 - DAILY_SPECIAL_DISCOUNT);
    const menuEmbed = new EmbedBuilder()

      .setTitle("VA-11 HALL-A Menu")
      .setDescription(`\`\`\`asciidoc\n${menuItems}\`\`\``)
      .setColor(0x2f3136)
      .setThumbnail(
        "https://upload.wikimedia.org/wikipedia/en/8/83/VA-11_HALL-A_logo.png",
      );

    // Create drink detail buttons
    const drinkButtons = drinks
      .slice(page * DRINKS_PER_PAGE, (page + 1) * DRINKS_PER_PAGE)
      .map(([name]) =>
        new ButtonBuilder()
          .setCustomId(`drink_${name.replace(/ /g, "_")}`)
          .setLabel(name)
          .setStyle(ButtonStyle.Secondary),
      );

    // Navigation controls
    const navButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("menu_prev")
        .setLabel("◄")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page <= 0),
      new ButtonBuilder()
        .setCustomId("menu_next")
        .setLabel("►")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page >= maxPage),
    );

    const components = [
      new ActionRowBuilder().addComponents(drinkButtons),
      navButtons,
    ];

    const responseMethod =
      interaction.deferred || interaction.replied ? "editReply" : "reply";
    await interaction[responseMethod]({
      embeds: [menuEmbed],
      components,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Menu Error:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "*static* Menu failure...",
        ephemeral: true,
      });
    }
  }
}

export async function handlePageTurn(interaction, direction) {
  const userId = interaction.user.id;
  const current = currentPage.get(userId) || 0;
  const newPage = direction === "prev" ? Math.max(0, current - 1) : current + 1;
  currentPage.set(userId, newPage);
  await showMenu(interaction);
}
