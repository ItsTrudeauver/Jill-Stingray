// neuralScanHandler.js
import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';

class Subsystem {
  constructor(name, emoji) {
    this.name = name;
    this.emoji = emoji;
    this.stability = 100;
    this.errors = [];
    this.lastScan = Date.now();
    this.cooldown = 30000;
  }

  generateStatus() {
    const now = Date.now();
    const timeDiff = now - this.lastScan;

    this.stability = Math.max(0, Math.min(100, 
      this.stability - (Math.random() * (timeDiff / 60000))
    ));

    if (Math.random() < 0.3) {
      this.errors.push({
        code: `ERR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: now
      });
    }

    this.lastScan = now;
    return this;
  }

  getASCII() {
    const stabilityBar = '█'.repeat(Math.floor(this.stability / 10)) + 
                        '░'.repeat(10 - Math.floor(this.stability / 10));
    return `
╔════════════════════════════════════════╗
 ${this.name} ${this.emoji}            
 STATUS:  ${stabilityBar} ${Math.floor(this.stability)}% 
 ERRORS:  ${this.errors.slice(-3).map(e => e.code).join(', ') || 'None'} 
╚════════════════════════════════════════╝

`;
  }
}

const subsystems = {
  firewall: new Subsystem('Firewall Matrix', '🛡️'),
  data_core: new Subsystem('Data Core', '💾'),
  personality: new Subsystem('Personality Forge', '👤'),
  combat: new Subsystem('Combat Protocols', '⚔️'),
  archive: new Subsystem('Temporal Archive', '⏳')
};

let easterEggActive = false;
const konamiSequence = ['firewall', 'combat', 'data_core'];
let inputHistory = [];

const ASCII_DIAGRAMS = {
  firewall: `
  \`\`\`
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █░░░░░░░░░░░░░░░░░░░█
  █░ENCRYPTION LAYER ░█
  █░░░░░░░░░░░░░░░░░░░█
  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  \`\`\`
 `,
  data_core: `
  \`\`\`
  ╔══════════════════╗
  ║ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ║
  ║ ▒  CORE V2.3   ▒ ║
  ║ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ║
  ╚══════════════════╝
  \`\`\`
  `,
  secret: `
  \`\`\`
  ╔═══ GLITCH CAT ═══╗
  ║ /\\_/\\          ║
  ║( o.o )           ║
  ║ > ^ <            ║
  ╚══════════════════╝
  SECRET SYSTEM: Nya!
  \`\`\`
  `
};

export async function handleNeuralDeepScan(interaction) { // Renamed here
  inputHistory = [];
  easterEggActive = false;

  const menuOptions = Object.entries(subsystems).map(([key, sys]) => ({
    label: sys.name,
    value: key,
    description: `Scan ${sys.name}`,
    emoji: sys.emoji
  }));

  if (easterEggActive) {
    menuOptions.push({
      label: '???',
      value: 'secret',
      description: 'Unknown subsystem',
      emoji: '❓'
    });
  }

  const selectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('neural_scan_select') // Changed custom ID
      .setPlaceholder('SELECT SUBSYSTEM TO SCAN')
      .addOptions(menuOptions)
  );

  const embed = new EmbedBuilder()
    .setColor('#00FF9D')
    .setTitle('**NEURAL NETWORK DIAGNOSTICS**') // Updated title
    .setDescription("```INITIALIZING JILL-OS SCANNERS```\n" + 
                   ASCII_DIAGRAMS.firewall)
    .setThumbnail('https://i.imgur.com/W7VJssL.png');

  await interaction.reply({ 
    embeds: [embed], 
    components: [selectMenu],
    ephemeral: false
  });

  const collector = interaction.channel.createMessageComponentCollector({ 
    filter: i => i.user.id === interaction.user.id,
    time: 30_000
  });

  collector.on('collect', async i => {
    inputHistory.push(i.values[0]);

    if (inputHistory.slice(-3).join(',') === konamiSequence.join(',')) {
      easterEggActive = true;
      subsystems.secret = new Subsystem('Glitch Cat', '🐱');
      ASCII_DIAGRAMS.secret = ASCII_DIAGRAMS.secret.replace('Nya!', `Nya! ${Math.random().toString(36).substr(2, 8)}`);
    }

    const selectedValue = i.values[0];
    let subsystem;

    if (selectedValue === 'secret' && easterEggActive) {
      subsystem = subsystems.secret;
    } else {
      subsystem = subsystems[selectedValue].generateStatus();
    }

    const statusEmbed = new EmbedBuilder()
      .setColor(subsystem.stability > 60 ? '#00FF9D' : '#FF003C')
      .setTitle(`**${subsystem.name.toUpperCase()} ANALYSIS**`)
      .setDescription(`\`\`\`diff\n${subsystem.getASCII()}\`\`\``)
      .addFields({
        name: 'DIAGNOSTIC READOUT',
        value: ASCII_DIAGRAMS[selectedValue] || ASCII_DIAGRAMS.firewall
      });

    if (selectedValue === 'secret') {
      statusEmbed.setImage('https://cataas.com/cat?glitch=1');
      statusEmbed.setFooter({ text: 'NYA-TER DETECTED! THIS DIDNT HURT ANY CATS... PROBABLY' });
    }

    await i.update({ 
      embeds: [statusEmbed],
      components: []
    });

    if (selectedValue !== 'secret') {
      subsystems[selectedValue].stability = Math.max(0, subsystem.stability - 5);
      setTimeout(() => {
        subsystems[selectedValue].stability = Math.min(100, subsystem.stability + 10);
      }, subsystems[selectedValue].cooldown);
    }
  });

  collector.on('end', collected => {
    if (collected.size === 0) {
      interaction.editReply({ 
        content: '```SCAN TERMINATED: INACTIVITY DETECTED```',
        components: [] 
      });
    }
  });
}