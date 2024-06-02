const ticketConfigController = require('../controllers/ticketConfigController');

module.exports = {
    id: 'confirmDeleteTicket',
    async execute(interaction) {
        const { guild, member, channel } = interaction;

        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        const deleteReason = interaction.fields.getTextInputValue('deleteReason');
        const userId = channel.permissionOverwrites.cache.find(po => po.type === 'member' && po.id !== config.staffRoleId).id;
        const user = await guild.members.fetch(userId);

        await user.send(`Tu ticket ha sido eliminado por ${member.user.tag} con el motivo: ${deleteReason}`);
        await interaction.reply({ content: `El ticket ha sido eliminado.`});
        
        setTimeout(() => channel.delete(), 5000); // Espera 5 segundos antes de eliminar el canal
    }
};
