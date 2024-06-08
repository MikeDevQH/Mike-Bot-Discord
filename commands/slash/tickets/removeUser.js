const { SlashCommandBuilder, EmbedBuilder  } = require('@discordjs/builders');
const ticketConfigController = require('../../../controllers/ticketConfigController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remueve un usuario de un ticket.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('El usuario que quieres remover del ticket.')
                .setRequired(true)),

    async execute(interaction) {
        const { member, channel, guild } = interaction;
        const userToRemove = interaction.options.getUser('user');

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
            await interaction.reply({ content: 'No tienes permiso para remover usuarios de este ticket.', ephemeral: true });
            return;
        }

        // Remover permisos al usuario especificado
        try {
            await channel.permissionOverwrites.edit(userToRemove.id, {
                ViewChannel: false,
                SendMessages: false,
                ReadMessageHistory: false,
            });

            // Crear y mandar el embed con la información del usuario removido
            const removeUserEmbed = new EmbedBuilder ()
                    .setDescription(`> El usuario ${userToRemove.tag} ha sido removido del ticket.`)
                    .setColor(0x3498db)

            await interaction.reply({ embeds: [removeUserEmbed] });
        
        } catch (error) {
            console.error('Error removing user from ticket:', error);
            await interaction.reply({ content: 'Hubo un error al remover el usuario del ticket.', ephemeral: true });
        }
    }
};
