import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import config from '../config.json' assert { type: 'json' };

const rest = new REST().setToken(config.token);

rest
  .put(Routes.applicationCommands(config.clientId), { body: [] })
  .then(() => console.log('Successfully deleted application commands.'))
  .catch(console.error);
