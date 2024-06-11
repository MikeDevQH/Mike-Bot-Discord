const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'deleteTicketReason',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('submitDeleteTicketReason')
            .setTitle('Motivo para eliminar el ticket');

        const reasonInput = new TextInputBuilder()
            .setCustomId('reasonInput')
            .setLabel('Por favor, proporciona un motivo')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(reasonInput);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};
