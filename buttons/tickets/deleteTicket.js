module.exports = {
    id: 'deleteTicket',
    async execute(interaction) {
        try {
            // Mostrar el modal para solicitar el motivo de eliminación
            const modalHandler = interaction.client.modals.get('deleteTicketReason');
            if (modalHandler) {
                await modalHandler.execute(interaction);
            }
        } catch (error) {
            console.error('Error en deleteTicket:', error);
            await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
        }
    }
};
