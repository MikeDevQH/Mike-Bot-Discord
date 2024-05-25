const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config/config.json');
const path = require('path');

const loadCommands = (client) => {
    client.commands = new Map();
    client.prefixCommands = new Map(); // Mapa para los comandos con prefijo

    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const command = require(path.join(__dirname, `../commands/${folder}/${file}`));
                if (command && command.data && command.data.name) {
                    client.commands.set(command.data.name, command);
                } else if (command && command.name) {
                    client.prefixCommands.set(command.name, command); // Carga los comandos con prefijo
                } else {
                    console.error(`Error al cargar el comando en ${folder}/${file}`);
                }
            } catch (error) {
                console.error(`Error al cargar el comando en ${folder}/${file}:`, error);
            }
        }
    }

    const dataPath = path.resolve(__dirname, '../data/data.json');
    client.data = require(dataPath);

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
            console.error(error);
        }
    })();

    console.log(`Loaded ${client.commands.size} slash commands and ${client.prefixCommands.size} prefix commands.`);
};

module.exports = {
    loadCommands,
};
