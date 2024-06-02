module.exports = {
    id: 'cancelCloseTicket',
    async execute(interaction) {
        await interaction.message.delete();
        await interaction.reply({ content: 'El cierre del ticket ha sido cancelado.', ephemeral: true });
    }
};
