import { BaseGameConfig } from './lib/game/game_config';

export const TOKEN = 'your-token-goes-here';

export const CLIENTID = 'your-clientId-goes-here';

export const GAMES_DEFAULT: (Required<BaseGameConfig> & {
  [property: string]: unknown;
})[] = [
  {
    gamemode: 'co-op',
    title: 'MTG Game',
    getMessage: (guesses: number, user: object) =>
      `Creating a new game with ${guesses} guesses...\nJoin this thread to play with ${user}!`,
    guesses: 10
  },
  {
    gamemode: 'versus',
    title: 'MTG Game',
    getMessage: (guesses: number, user: object, opponent: object) =>
      `Creating a new game with ${guesses} guesses...\n${user} challenged ${opponent} to a duel!`,
    guesses: 10
  }
];
