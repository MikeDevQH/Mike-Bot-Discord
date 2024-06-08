const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const staffStatsController = require('../../../controllers/staffStatsController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Muestra el top de tickets reclamados por los miembros del staff.'),

    async execute(interaction) {
        await interaction.deferReply();

        const { guild } = interaction;

        // Obtener el top de miembros del staff
        let topStaff;
        try {
            topStaff = await staffStatsController.getTopStaff(guild.id);
        } catch (error) {
            console.error('Error retrieving top staff:', error);
            await interaction.editReply({ content: 'Hubo un error al recuperar el top de tickets reclamados.', ephemeral: true });
            return;
        }

        if (!topStaff || topStaff.length === 0) {
            await interaction.editReply({ content: 'No hay estadísticas disponibles.', ephemeral: true });
            return;
        }

        // Construir el embed
        const embed = new EmbedBuilder()
            .setTitle('Top de Tickets Reclamados')
            .setColor(0x3498db)
            .setDescription('Listado de los miembros del staff con más tickets reclamados:')
            .setTimestamp();

        // Medallas
        const medals = ['🥇', '🥈', '🥉'];

        topStaff.slice(0, 10).forEach((staff, index) => {
            const member = guild.members.cache.get(staff.staffId);
            const medal = medals[index] || ''; // Asignar medalla si está en el top 3

            embed.addFields({ 
                name: `${index + 1}. ${member ? member.user.tag : 'Usuario desconocido'} ${medal}`, 
                value: `${staff.claimedTickets} tickets reclamados`, 
                inline: false 
            });
        });

        await interaction.editReply({ embeds: [embed] });
    }
};
