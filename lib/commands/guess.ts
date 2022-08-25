import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import { UserError } from '../utils/errors.js';

export default {
  data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Make a guess')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('card')
        .setDescription('The card that you are guessing')
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async execute(
    interaction: ChatInputCommandInteraction | AutocompleteInteraction
  ) {
    if (interaction.isChatInputCommand()) {
      // Validation -> is in Thread
      const isThread = interaction.channel?.isThread();
      if (!isThread) {
        throw new UserError('Not in a game battlefield');
      }

      // Validation -> Bot is the thread owner
      await interaction.channel.fetchOwner();
      const ownerId = interaction.channel.ownerId;
      if (interaction.client.user?.id !== ownerId) {
        throw new UserError('Not in a game battlefield');
      }

      await interaction.reply('ok buddy');
      return;
    }
    if (interaction.isAutocomplete()) {
      const focusedValue = interaction.options.getFocused();
      const choices = [...Array(1000).keys()].map((n) => n.toString());
      const filtered = choices.filter((choice) =>
        choice.startsWith(focusedValue)
      );
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
  }
};
