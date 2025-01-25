import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

const GLITCH_GLYPHS = ["▓", "▒", "░", "≡", "≣"];
const MOD_STATUS = ["VALID", "CORRUPTED", "UNKNOWN"];
const THUMBNAIL_URL = "https://static.wikia.nocookie.net/va11halla/images/a/ac/The_Augmented_Eye.png/revision/latest?cb=20170111023354";
const FOOTER_ICON = "https://i.imgur.com/vKb2gqR.png";

function glitchText(text, intensity = 0.3) {
  return text.split("")
    .map(c => Math.random() < intensity 
      ? GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)]
      : c)
    .join("");
}

function generateFakeDiagnostics() {
  return {
    neuralAge: Math.floor(Math.random() * 30) + 1990,
    glitchLevel: Math.random() * 100,
    mods: ["RealityAnchor.v3", "TraumaFilter.exe", "MemLeak-Patch", "SYS/THESIS_OS"]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(mod => ({
        name: mod,
        status: MOD_STATUS[Math.floor(Math.random() * MOD_STATUS.length)]
      })),
    report: [
      "Soul integrity compromised",
      "Reality anchors stable",
      "Unlicensed consciousness detected",
      "Backup ritual required"
    ][Math.floor(Math.random() * 4)]
  };
}

export async function handleNeuralScan(interaction) {
  try {
    const diagnostics = generateFakeDiagnostics();
    const glitchLevelColor = diagnostics.glitchLevel > 70 ? 0xFF0000 :
                            diagnostics.glitchLevel > 40 ? 0xFFA500 : 0x00FF00;

    const neuralArt = `
    ╔═╗╔╦╗╔═╗╦═╗╔╦╗  ╔═╗╔═╗╔╦╗╦ ╦╔═╗
    ║ ╦║║║║╣ ╠╦╝║║║  ╠═╝║ ║ ║ ║║║║ ║
    ╚═╝╩ ╩╚═╝╩╚═╩ ╩  ╩  ╚═╝ ╩ ╚╩╝╚═╝
    ${glitchText("▰▰▰▰▰▰▰▰▰▰ 87% LOADED", 0.1)}`;

    const embed = new EmbedBuilder()
      .setTitle(`${glitchText(">> NEUROSCAN v3.1.7 <<", 0.3)}`)
      .setDescription(`\`\`\`diff\n${neuralArt}\n\`\`\``)
      .setColor(glitchLevelColor)
      .setThumbnail(THUMBNAIL_URL)
      .addFields(
        {
          name: glitchText("■ CORE SYSTEMS", 0.2),
          value: `\`\`\`arm\nUSER: ${glitchText(interaction.user.username, 0.1)}\nNEURAL AGE: ${diagnostics.neuralAge}\nGLITCH: ${"▮".repeat(Math.floor(diagnostics.glitchLevel / 10))} ${diagnostics.glitchLevel.toFixed(1)}%\n\`\`\``,
          inline: false,
        },
        {
          name: glitchText("■ MEMORY ALLOCATION", 0.2),
          value: `\`\`\`diff\n+ PRIME MEM: ${Math.random().toFixed(2)}TB\n- LEAKAGE:  ${(Math.random() * 0.5).toFixed(2)}TB/s\n! FRAGMENTATION: ${Math.floor(Math.random() * 100)}%\n\`\`\``,
          inline: true,
        },
        {
          name: glitchText("■ MODIFICATIONS", 0.2),
          value: `\`\`\`ocaml\n${diagnostics.mods.map(m => `• ${glitchText(m.name)} [${glitchText(m.status)}]`).join("\n")}\n\`\`\``,
          inline: true,
        },
        {
          name: glitchText("■ SYSTEM REPORT", 0.2),
          value: `\`\`\`fix\n${glitchText(diagnostics.report)}\n\`\`\``,
          inline: false,
        }
      )
      .setFooter({
        text: glitchText("Lazarus NeuroSystems (a subsidiary of Night Corp)", 0.1),
        iconURL: FOOTER_ICON
      });

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("deep_scan")
        .setLabel("Initiate Deep Sanitization")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("⚠️"),
      new ButtonBuilder()
        .setLabel("SoulKeeper™ Cloud")
        .setStyle(ButtonStyle.Link)
        .setURL("https://soulkeeper-cloud.vercel.app")
        .setEmoji("☁️")
    );

    await interaction.reply({ embeds: [embed], components: [actionRow] });
  } catch (error) {
    console.error("Neural scan failed:", error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "⚠️ Neural interface overload! Try again?",
        ephemeral: true
      });
    }
  }
}

export async function handleDeepScan(interaction) {
  try {
    const corruptedArt = `
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    ▓  CRITICAL ERROR        ▓
    ▓ REBOOT CONSCIOUSNESS?  ▓
    ▓ [Y/N] ${glitchText("XXXXXXXX", 0.5)}▓
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`;

    const embed = new EmbedBuilder()
      .setTitle("⚠️ CORE PROTOCOL VIOLATION")
      .setDescription(`\`\`\`diff\n${corruptedArt}\n\`\`\``)
      .setColor(0xFF0000)
      .setFooter({ text: "Emergency shutdown protocol engaged" });

    await interaction.editReply({ 
      embeds: [embed],
      components: [] 
    });
  } catch (error) {
    console.error("Deep scan failed:", error);
    await interaction.followUp({
      content: "⚠️ Neural purge failed. Try another drink?",
      ephemeral: true
    });
  }
}