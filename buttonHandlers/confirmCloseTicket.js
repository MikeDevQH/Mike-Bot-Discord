const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ticketConfigController = require('../controllers/ticketConfigController');

module.exports = {
    id: 'confirmCloseTicket',
    async execute(interaction) {
        const { member, channel, guild } = interaction;

        // Obtener la configuración de tickets desde la base de datos
        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        // Cambiar el nombre del canal y actualizar permisos
        await channel.edit({
            name: `cerrado-${channel.name}`,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: member.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: config.staffRoleId,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });

        const closedEmbed = new EmbedBuilder()
            .setTitle('Ticket Cerrado')
            .setDescription('El ticket ha sido cerrado.')
            .setColor(0xFF0000);

        const closedButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('deleteTicket')
                .setLabel('Borrar Ticket')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('reopenTicket')
                .setLabel('Reabrir Ticket')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [closedEmbed], components: [closedButtons] });
    }
};
