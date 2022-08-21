import { readFileSync } from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
// TODO: Replace this with the import below when it becomes supported by eslint
// (https://github.com/eslint/eslint/discussions/15305)
// import config from './config.json' assert { type: 'json' };
const config = JSON.parse(readFileSync('config.json'));

const rest = new REST().setToken(config.token);

rest
  .put(Routes.applicationCommands(config.clientId), { body: [] })
  .then(() => console.log('Successfully deleted application commands.'))
  .catch(console.error);
