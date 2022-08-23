import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  Client,
  Collection,
  SimplifiedCommand,
  GatewayIntentBits
} from 'discord.js';
import gameManager from './game/GameManager.js';
import config from '../config.json' assert { type: 'json' };

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection<string, SimplifiedCommand>();
const commandsPath = new URL('commands', import.meta.url).pathname;
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith('.js')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const { default: commandImport } = await import(filePath);
  const command: SimplifiedCommand = {
    name: commandImport.data.name,
    execute: commandImport.execute
  };
  client.commands.set(command.name, command);
  console.log('hi');
}

client.once('ready', () => {
  console.log('MTG Bot is ready!');
  gameManager.increment();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  }
});

client.login(config.token);