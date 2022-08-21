import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
// TODO: Replace this with the import below when it becomes supported by eslint
// (https://github.com/eslint/eslint/discussions/15305)
// import config from './config.json' assert { type: 'json' };
const config = JSON.parse(readFileSync('config.json'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = new URL('commands', import.meta.url).pathname;
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith('.js')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const { default: command } = await import(filePath);
  client.commands.set(command.data.name, command);
}
client.once('ready', () => {
  console.log('MTG Bot is ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  }
});

client.login(config.token);
