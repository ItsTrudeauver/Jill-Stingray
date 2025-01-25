import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const INVITE_IMAGE = "https://i.pinimg.com/736x/0f/b9/ea/0fb9eab8d84af11bb9d28ec3e7894ef4.jpg";
const NEON_CYAN = "#00FF9D";

export async function handleInvite(interaction) {
    const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
        .setColor(NEON_CYAN)
        .setTitle("**NEURAL LINK ESTABLISHMENT**")
        .setDescription("```ACCESS CODE: JILL-OS-2077```\n*Initiate protocol to sync with Glitch City Grid*")
        .setImage(INVITE_IMAGE)
        .setFooter({ text: "Glitch City Systems © 2077 | Authorization Required", iconURL: "https://i.imgur.com/W7VJssL.png" });

    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("INITIATE SYNC")
            .setStyle(ButtonStyle.Link)
            .setURL(inviteURL)
            .setEmoji("🔌")
    );

    await interaction.reply({
        embeds: [embed],
        components: [button],
        ephemeral: true
    });
}