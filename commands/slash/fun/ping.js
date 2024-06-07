const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra el ping del usuario.'),

    async execute(interaction) {
        // Calcular el ping del usuario
        const userPing = Date.now() - interaction.createdTimestamp;

        // Construir el mensaje embed
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Ping del Usuario')
            .setDescription(`Tu ping es: ${userPing}ms`)
            .setTimestamp();

        // Enviar el mensaje embed
        await interaction.reply({ embeds: [embed] });
    },
};