export type BaseGameConfig = Readonly<{
  gamemode: string;
  title: string;
  getMessage(...args: unknown[]): string;
}>;

export type CoopGameConfig = BaseGameConfig &
  Readonly<{
    guesses: number;
  }>;

export type VersusGameConfig = BaseGameConfig &
  Readonly<{
    guesses: number;
  }>;
