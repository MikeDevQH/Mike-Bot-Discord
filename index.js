const { Client } = require('discord.js');
require('dotenv').config();
const { loadCommands } = require('./handlers/commandHandler');
const readyHandler = require('./events/ready');
const interactionCreateHandler = require('./events/interactionCreate');
const messageEventsHandler = require('./events/messageEvents');
const prefixCommandHandler = require('./handlers/prefixCommandHandler'); // Importamos 
const config = require('./config/config.json');

const client = new Client({
    intents: 3272703
});

readyHandler(client);
interactionCreateHandler(client);
messageEventsHandler(client);
prefixCommandHandler(client, config.prefix); 
loadCommands(client);

client.login(process.env.DISCORD_TOKEN);
