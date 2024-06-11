const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../../data/data.json');
let data = require(dataPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Configura canales de registro.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('mod')
                .setDescription('Configura el canal para registros de sanciones.')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('El canal para enviar los registros de sanciones.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('msg')
                .setDescription('Configura el canal para registrar mensajes eliminados/editados.')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('El canal para registrar mensajes.')
                        .setRequired(true))),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('canal');

        if (subcommand === 'mod') {
            data.modLogChannelId = channel.id;
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            await interaction.reply({ content: `Canal de registros de sanciones configurado en ${channel}`, ephemeral: true });
        } else if (subcommand === 'msg') {
            data.msgLogChannelId = channel.id;
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            await interaction.reply({ content: `Canal de registro de mensajes configurado en ${channel}`, ephemeral: true });
        }
    },
};
