// Importar módulos necesarios
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json'); // Configuración del bot
const path = require('path');
const dataPath = path.resolve(__dirname, '../data.json'); // Ruta al archivo de datos
let data = require(dataPath); // Cargar datos desde el archivo JSON

// Función para obtener el número de caso y actualizar los datos
const getCaseNumber = (type) => {
    if (type === 'ban') {
        data.banCaseCount += 1; // Incrementar el número de casos de ban
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); // Escribir datos actualizados en el archivo
        return data.banCaseCount; // Devolver el número de caso actualizado de ban
    } else if (type === 'mute') {
        data.muteCaseCount += 1; // Incrementar el número de casos de mute
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); // Escribir datos actualizados en el archivo
        return data.muteCaseCount; // Devolver el número de caso actualizado de mute
    } else if (type === 'kick') {
        data.kickCaseCount += 1; // Incrementar el número de casos de kick
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); // Escribir datos actualizados en el archivo
        return data.muteCaseCount; // Devolver el número de caso actualizado de kick
    }    
    return null; // Si no es ni ban ni mute ni kick, devolver null
};

// Función para cargar comandos desde los archivos
const loadCommands = (client) => {
    client.commands = new Map(); // Crear un mapa para almacenar los comandos

    const commandFolders = fs.readdirSync('./commands'); // Leer carpetas de comandos

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')); // Leer archivos de comandos

        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`); // Requerir el archivo de comando
            client.commands.set(command.data.name, command); // Añadir el comando al mapa
        }
    }

    // Convertir los datos de los comandos a JSON y registrarlos en Discord
    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN); // Establecer token del bot

    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands }
            );
            console.log('Successfully registered application commands.'); // Registro exitoso de comandos en Discord
        } catch (error) {
            console.error(error);
        }
    })();

    console.log(`Loaded ${client.commands.size} commands.`); // Registro de cantidad de comandos cargados
};

// Función para manejar el evento de listo (ready)
const readyHandler = (client) => {
    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`); // Registro de inicio de sesión exitoso
    });
};

// Función para manejar interacciones con Discord
const interactionCreateHandler = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return; // Si la interacción no es un comando, salir

        const command = client.commands.get(interaction.commandName); // Obtener el comando

        if (!command) return; // Si no hay comando, salir

        try {
            await command.execute(interaction); // Ejecutar el comando
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); // Responder en caso de error
        }
    });
};

// Exportar las funciones para su uso en otros módulos
module.exports = {
    loadCommands,
    readyHandler,
    interactionCreateHandler,
    getCaseNumber,
};
