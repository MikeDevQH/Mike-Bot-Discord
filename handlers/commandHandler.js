const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js');
const path = require('path');
const config = require('../config/config.json');

const loadCommands = (client) => {
    client.commands = new Collection();
    client.prefixCommands = new Collection(); // Mapa para los comandos con prefijo
    client.buttonHandlers = new Map(); // Mapa para los manejadores de botones
    client.selectMenuHandlers = new Map(); // Mapa para los manejadores de menús desplegables

    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const command = require(path.join(__dirname, `../commands/${folder}/${file}`));
                if (command && command.data && command.data.name) {
                    client.commands.set(command.data.name, command); // Carga los comandos de slash
                } else if (command && command.name) {
                    client.prefixCommands.set(command.name, command); // Carga los comandos con prefijo
                } else if (command && command.id) {
                    if (file.startsWith('select')) {
                        client.selectMenuHandlers.set(command.id, command); // Carga los menús desplegables
                    } else if (file.startsWith('button')) {
                        client.buttonHandlers.set(command.id, command); // Carga los botones
                    }
                } else {
                    console.error(`Error al cargar el comando en ${folder}/${file}`);
                }
            } catch (error) {
                console.error(`Error al cargar el comando en ${folder}/${file}:`, error);
            }
        }
    }

    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());

    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands }
            );
            console.log('Successfully registered application commands.');
        } catch (error) {
            console.error('Error registering application commands:', error);
        }
    })();

    console.log(`Loaded ${client.commands.size} slash commands, ${client.prefixCommands.size} prefix commands.`);
};

module.exports = {
    loadCommands,
};
