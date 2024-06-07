const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const ticketConfigController = require('../../controllers/ticketConfigController');

module.exports = {
    id: 'closeTicket',
    async execute(interaction) {
        const { member, channel, guild } = interaction;

        // Obtener la configuración de tickets desde la base de datos
        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        // Verificar si el usuario tiene el rol de staff
        if (!member.roles.cache.has(config.staffRoleId)) {
            await interaction.reply({ content: 'No tienes permiso para cerrar este ticket.', ephemeral: true });
            return;
        }

        const confirmEmbed = new EmbedBuilder()
            .setTitle('Confirmación de Cierre')
            .setDescription('¿Estás seguro de que deseas cerrar este ticket?')
            .setColor('#ff0000');

        const confirmButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirmCloseTicket')
                .setLabel('Sí')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('cancelCloseTicket')
                .setLabel('No')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [confirmEmbed], components: [confirmButtons] });
    }
};
