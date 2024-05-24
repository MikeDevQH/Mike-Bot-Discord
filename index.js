const { Client } = require('discord.js');
require('dotenv').config();
const { loadCommands } = require('./handlers/commandHandler');
const readyHandler = require('./events/ready');
const interactionCreateHandler = require('./events/interactionCreate');

const client = new Client({
    intents: 3272703
});

readyHandler(client);
interactionCreateHandler(client);
loadCommands(client);

client.login(process.env.DISCORD_TOKEN);
