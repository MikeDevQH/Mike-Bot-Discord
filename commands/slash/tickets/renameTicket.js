const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const ticketConfigController = require('../../../controllers/ticketConfigController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Renombra un ticket.')
        .addStringOption(option => 
            option.setName('newname')
                .setDescription('El nuevo nombre para el ticket.')
                .setRequired(true)),

    async execute(interaction) {
        const { member, channel, guild } = interaction;
        const newName = interaction.options.getString('newname');

        // Obtener la configuración de tickets desde la base de datos
        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        // Verificar si el canal está en alguna de las categorías de tickets configuradas
        const ticketCategories = config.categoryNames;
        if (!ticketCategories.includes(channel.parent.name)) {
            await interaction.reply({ content: 'Este comando solo puede usarse en canales de tickets.', ephemeral: true });
            return;
        }

        // Verificar si el usuario tiene el rol de staff
        if (!member.roles.cache.has(config.staffRoleId)) {
            await interaction.reply({ content: 'No tienes permiso para renombrar este ticket.', ephemeral: true });
            return;
        }

        // Renombrar el canal
        try {

            const renameEmbed = new EmbedBuilder()
                    .setDescription(`> El ticket ha sido renombrado de \`${channel.name}\` a \`${newName}\`.`)
                    .setColor(0x3498db)
                    

            await interaction.reply({ embeds: [renameEmbed] });
            await channel.setName(newName);
        } catch (error) {
            console.error('Error renaming ticket:', error);
            await interaction.reply({ content: 'Hubo un error al renombrar el ticket.', ephemeral: true });
        }
    }
};
