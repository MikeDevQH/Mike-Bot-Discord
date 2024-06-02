const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'deleteTicket',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('confirmDeleteTicket')
            .setTitle('Confirmar Eliminación de Ticket');

        const reasonInput = new TextInputBuilder()
            .setCustomId('deleteReason')
            .setLabel('Motivo de la eliminación')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};
