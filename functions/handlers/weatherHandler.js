import { EmbedBuilder } from "discord.js";
import { getCurrentWeather, rotateWeather } from "../services/weatherService.js";

export async function handleWeather(interaction) {
  if (!interaction.guild.weatherLastUpdated || Date.now() - interaction.guild.weatherLastUpdated > 86400000) {
    await rotateWeather(interaction.guild);
  }

  const weather = getCurrentWeather(interaction.guild.id);

  const embed = new EmbedBuilder()
    .setColor('#00FF9D')
    .setTitle(`🌐 ${weather.name}`)
    .setDescription(`\`\`\`fix\n${weather.ascii}\`\`\``)
    .addFields(
      { name: 'Effect', value: weather.effect, inline: true },
      { name: 'Recommended Drink', value: weather.drink, inline: true }
    )
    .setFooter({ text: 'Glitch City Meteorological Division' });

  await interaction.reply({ embeds: [embed] });
}