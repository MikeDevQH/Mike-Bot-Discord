const { Client } = require('discord.js');
require('dotenv').config();
const { loadCommands } = require('./handlers/commandHandler');
const readyHandler = require('./events/ready');
const interactionCreateHandler = require('./events/interactionCreate');
const messageEventsHandler = require('./events/messageEvents');
const prefixCommandHandler = require('./handlers/prefixCommandHandler'); 
const { loadButtons } = require('./handlers/buttonHandler'); 
const { loadSelectMenus } = require('./handlers/selectMenuHandler'); 
const config = require('./config/config.json');
const connectDB = require('./utils/database');

const client = new Client({
    intents: 3272703
});

// Conectar a la base de datos MongoDB
connectDB();

readyHandler(client);
interactionCreateHandler(client);
messageEventsHandler(client);
prefixCommandHandler(client, config.prefix); 

// Cargar comandos, botones y menús desplegables
loadCommands(client);
loadButtons(client); // Cargar los manejadores de botones
loadSelectMenus(client); // Cargar los manejadores de menús desplegables

client.on('error', (error) =>{
    console.log("Hay un error del bot en:", error)
});

// Iniciar sesión en Discord con el token del bot
client.login(process.env.DISCORD_TOKEN);
