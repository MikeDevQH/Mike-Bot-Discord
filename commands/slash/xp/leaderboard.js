const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../../models/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Muestra la tabla de clasificación de niveles para este servidor'),

    async execute(interaction) {
        const guildId = interaction.guild.id;

        try {
            // Obtener los perfiles de usuario de este servidor, ordenados por nivel, XP y cantidad de mensajes
            const topUsers = await getTopUsers(guildId);

            if (topUsers.length === 0) {
                return interaction.reply({ content: 'No hay usuarios registrados en la tabla de clasificación.', ephemeral: true });
            }

            // Construir el embed para mostrar la tabla de clasificación
            const leaderboardEmbed = new EmbedBuilder()
                .setTitle('Tabla de Clasificación de Niveles')
                .setDescription(`Top usuarios del servidor **${interaction.guild.name}**`)
                .setColor('#8A63FF')
                .setTimestamp();

            topUsers.forEach((user, index) => {
                leaderboardEmbed.addFields({
                    name: `#${index + 1} - ${user.username}`,
                    value: `Nivel: ${user.level} | XP: ${user.xp} | Mensajes: ${user.messages}`,
                    inline: false
                });
            });

            // Enviar el embed
            await interaction.reply({ embeds: [leaderboardEmbed] });

        } catch (error) {
            console.error('Error al generar la tabla de clasificación:', error);
            await interaction.reply({ content: 'Hubo un error al mostrar la tabla de clasificación.', ephemeral: true });
        }
    },
};

// Función para obtener los mejores usuarios de un servidor específico
async function getTopUsers(guildId) {
    const users = await UserProfile.aggregate([
        { $unwind: '$levels' },
        { $match: { 'levels.guildId': guildId } },
        { $sort: { 'levels.level': -1, 'levels.xp': -1 } }, // Ordenar por nivel y luego por XP
        { $limit: 10 }, // Limitar a los 10 mejores usuarios
        { $project: { username: 1, 'levels.level': 1, 'levels.xp': 1, 'levels.messages': 1 } }
    ]);

    return users.map(user => ({
        username: user.username,
        level: user.levels.level,
        xp: user.levels.xp,
        messages: user.levels.messages
    }));
}
