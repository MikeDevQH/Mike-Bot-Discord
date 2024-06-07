module.exports = {
    id: 'cancelCloseTicket',
    async execute(interaction) {
        await interaction.message.delete();
        await interaction.reply({ content: 'Has cancelado el cierre del ticket.', ephemeral: true });
    }
};
