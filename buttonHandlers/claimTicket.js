const { PermissionFlagsBits } = require('discord.js');
const ticketConfigController = require('../controllers/ticketConfigController');

module.exports = {
    id: 'claimTicket',
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
            await interaction.reply({ content: 'No tienes permiso para reclamar este ticket.', ephemeral: true });
            return;
        }

        // Verificar si el ticket ya ha sido reclamado
        if (channel.permissionOverwrites.cache.has(member.id)) {
            await interaction.reply({ content: 'Ya has reclamado este ticket.', ephemeral: true });
            return;
        }

        // Conceder permisos de acceso al usuario que reclama el ticket
        await channel.permissionOverwrites.edit(member.id, {
            ViewChannel: true,
            SendMessages: true,
        });

        await interaction.reply({ content: `Ticket reclamado por ${member.user.tag}.` });
    }
};
