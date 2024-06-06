const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Hazle una pregunta al bot')
        .addStringOption(option =>
            option.setName('pregunta')
                .setDescription('Hazle una pregunta al bot')
                .setRequired(true)),

    async execute(interaction) {
        const pgr = interaction.options.getString('pregunta');

        const respuestas = [
            "Sí",
            "No",
            "Tal vez",
            "Probablemente",
            "No cuentes con ello",
            "No puedo predecir ahora",
            "Mejor no te lo digo ahora",
            "Concéntrate y pregunta de nuevo"
        ];

        const botRespuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // Elige un color
            .setTitle('🎱 8-Ball')
            .addFields(
                { name: 'Pregunta:', value: pgr, inline: false },
                { name: 'Respuesta:', value: `**${botRespuesta}**`, inline: false }
            )
            .setFooter({ text: 'Espero haberte ayudado con tu pregunta!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
