const { Client } = require('discord.js');
require('dotenv').config();
const config = require('./config.json');
const { loadCommands, readyHandler, interactionCreateHandler } = require('./Handlers/handler');

const client = new Client({
    intents: 3272703
});

readyHandler(client);
interactionCreateHandler(client);
// Mueve la carga de comandos aquí
loadCommands(client);

client.login(process.env.DISCORD_TOKEN);
