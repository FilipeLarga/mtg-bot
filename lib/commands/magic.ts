import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { GAMES_DEFAULT } from '../../config.js';
import {
  BaseGameConfig,
  CoopGameConfig,
  VersusGameConfig
} from '../game/game_config.js';
import { UserError } from '../utils/errors.js';

export default {
  data: new SlashCommandBuilder()
    .setName('magic')
    .setDescription('Create a new game')
    .setDMPermission(false)
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
  async execute(interaction: ChatInputCommandInteraction) {
    // Validation -> Not in a thread
    const isThread: boolean = interaction.channel?.isThread() ?? false;
    if (isThread) {
      await interaction.reply({
        content: 'Cannot start game inside a thread',
        ephemeral: true
      });
      return;
    }

    // Validation -> Gamemode exists
    const gamemode = interaction.options.getSubcommand(true);
    const gameConfig = (GAMES_DEFAULT as BaseGameConfig[]).find(
      (game) => game.gamemode === gamemode
    );
    if (gameConfig === undefined) {
      console.error(`No gamemode ${gamemode} defined in config`);
      throw new Error();
    }

    switch (gameConfig.gamemode) {
      case 'co-op': {
        const coopConfig = gameConfig as CoopGameConfig;
        const user = interaction.user;
        const guesses =
          interaction.options.getInteger('guesses', false) ??
          coopConfig.guesses;
        const message = coopConfig.getMessage(guesses, user);

        const threadMessage = await interaction.reply({
          content: message,
          fetchReply: true
        });
        threadMessage.startThread({
          name: coopConfig.title,
          autoArchiveDuration: 60,
          reason: 'Battlefield for the game'
        });

        break;
      }

      case 'versus': {
        const versusConfig = gameConfig as VersusGameConfig;
        const user = interaction.user;
        const guesses =
          interaction.options.getInteger('guesses', false) ??
          versusConfig.guesses;
        const opponent = interaction.options.getUser('opponent', true);
        const message = versusConfig.getMessage(guesses, user, opponent);

        if (opponent.id === user.id) {
          throw new UserError('You cannot play against yourself!');
        }

        const threadMessage = await interaction.reply({
          content: message,
          fetchReply: true
        });
        threadMessage.startThread({
          name: versusConfig.title,
          autoArchiveDuration: 60,
          reason: 'Battlefield for the game'
        });
      }
    }
  }
};
