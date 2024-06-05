const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js');
const path = require('path');
const config = require('../config/config.json');

const loadCommands = (client, dir) => {
    const commandFiles = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of commandFiles) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            loadCommands(client, filePath); // Si es una carpeta, buscar comandos dentro de ella
        } else if (file.name.endsWith('.js')) {
            try {
                const command = require(filePath);
                if (command && command.data && command.data.name) {
                    client.commands.set(command.data.name, command); // Carga los comandos de slash
                } else if (command && command.name) {
                    client.prefixCommands.set(command.name, command); // Carga los comandos con prefijo
                } else if (command && command.id) {
                    if (file.name.startsWith('select')) {
                        client.selectMenuHandlers.set(command.id, command); // Carga los menús desplegables
                    } else if (file.name.startsWith('button')) {
                        client.buttonHandlers.set(command.id, command); // Carga los botones
                    }
                } else {
                    console.error(`Error al cargar el comando en ${filePath}`);
                }
            } catch (error) {
                console.error(`Error al cargar el comando en ${filePath}:`, error);
            }
        }
    }
};

const registerSlashCommands = async (client) => {
    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    try {
        await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error('Error registering application commands:', error);
    }
};

const loadAllCommands = (client) => {
    client.commands = new Collection();
    client.prefixCommands = new Collection(); // Mapa para los comandos con prefijo
    client.buttonHandlers = new Map(); // Mapa para los manejadores de botones
    client.selectMenuHandlers = new Map(); // Mapa para los manejadores de menús desplegables

    const commandsDir = path.join(__dirname, '../commands');
    loadCommands(client, commandsDir);
    registerSlashCommands(client);

    console.log(`Loaded ${client.commands.size} slash commands, ${client.prefixCommands.size} prefix commands.`);
};

module.exports = {
    loadAllCommands,
};
