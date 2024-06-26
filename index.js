const { Client } = require('discord.js');
require('dotenv').config();
const { loadAllCommands } = require('./handlers/commandHandler');
const readyHandler = require('./events/ready');
const interactionCreateHandler = require('./events/interactionCreate');
const messageEventsHandler = require('./events/messageEvents');
const { loadButtons } = require('./handlers/buttonHandler'); 
const { loadSelectMenus } = require('./handlers/selectMenuHandler'); 
const { loadModals } = require('./handlers/modalHandler');
const connectDB = require('./utils/database');

const client = new Client({
    intents: 3272703
});

// Conectar a la base de datos MongoDB
connectDB();

readyHandler(client);
interactionCreateHandler(client);
messageEventsHandler(client);

// Cargar comandos, botones y menús desplegables
loadAllCommands(client);
loadButtons(client); // Cargar los manejadores de botones
loadSelectMenus(client); // Cargar los manejadores de menús desplegables
loadModals(client); // Cargar los manejadores de modales

client.on('error', (error) =>{
    console.log("Hay un error del bot en:", error)
});

// Iniciar sesión en Discord con el token del bot
client.login(process.env.DISCORD_TOKEN);
