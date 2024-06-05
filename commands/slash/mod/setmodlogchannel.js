const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../../data/data.json');
let data = require(dataPath);

// Definir el comando 'setmodchannel' con su descripción y opciones
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmodlogchannel')
        .setDescription('Configura el canal de registros para comandos de moderación.')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('El canal para enviar los registros de comandos de moderación.')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('canal');
        data.modLogChannelId = channel.id;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        await interaction.reply({ content: `Canal de registros de sanciones configurado en ${channel}`, ephemeral: true });
    },
};
