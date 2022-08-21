import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('magic')
    .setDescription('Create a new game'),
  async execute(interaction) {
    await interaction.reply('Creating a new game... (not)');
  }
};
