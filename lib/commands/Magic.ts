import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import gameManager from '../game/GameManager.js';

gameManager.increment();

export default {
  data: new SlashCommandBuilder()
    .setName('magic')
    .setDescription('Create a new game')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('co-op')
        .setDescription('Play together with friends')
        .addIntegerOption((option) =>
          option
            .setName('guesses')
            .setDescription('The number of attempts until you lose')
            .setMinValue(5)
            .setMaxValue(20)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('versus')
        .setDescription('Play versus a friend')
        .addUserOption((option) =>
          option
            .setName('opponent')
            .setDescription("The player you're up against")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('guesses')
            .setDescription('The number of attempts until you lose')
            .setMinValue(5)
            .setMaxValue(20)
        )
    ),
  async execute(interaction: CommandInteraction) {
    const isThread: boolean = interaction.channel?.isThread() ?? false;
    if (isThread) {
      await interaction.reply({
        content: 'Cannot start game inside a thread',
        ephemeral: true
      });
      return;
    }

    await interaction.reply('Creating a new game... (not)');
  }
};
