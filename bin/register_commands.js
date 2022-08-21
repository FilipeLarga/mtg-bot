import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
// TODO: Replace this with the import below when it becomes supported by eslint
// (https://github.com/eslint/eslint/discussions/15305)
// import config from './config.json' assert { type: 'json' };
const config = JSON.parse(readFileSync('config.json'));

const commands = [];
const commandsPath = new URL('../commands', import.meta.url).pathname;
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith('.js')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const { default: command } = await import(filePath);
  commands.push(command.data.toJSON());
}

if (commands.length === 0) {
  throw new Error('No commands found to deploy');
}

const rest = new REST().setToken(config.token);
rest
  .put(Routes.applicationCommands(config.clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
