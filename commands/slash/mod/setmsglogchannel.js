const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../../data/data.json');
let data = require(dataPath);

// Definir el comando 'setmsglogchannel' con su descripción y opciones
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmsglogchannel')
        .setDescription('Configura el canal para registrar mensajes eliminados/editados.')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('El canal para registrar mensajes')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
             return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
       }

        const channel = interaction.options.getChannel('canal');
        data.msgLogChannelId = channel.id;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        await interaction.reply({content: `Canal de registro de mensajes configurado en ${channel}`, ephemeral: true});
    },
};
