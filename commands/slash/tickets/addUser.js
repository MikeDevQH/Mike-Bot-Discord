const { SlashCommandBuilder, EmbedBuilder  } = require('@discordjs/builders');
const ticketConfigController = require('../../../controllers/ticketConfigController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Agrega un usuario a un ticket.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('El usuario que quieres agregar al ticket.')
                .setRequired(true)),

    async execute(interaction) {
        const { member, channel, guild } = interaction;
        const userToAdd = interaction.options.getUser('user');

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
            await interaction.reply({ content: 'No tienes permiso para agregar usuarios a este ticket.', ephemeral: true });
            return;
        }

        // Otorgar permisos al usuario especificado
        try {
            await channel.permissionOverwrites.edit(userToAdd.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
            });

            // Crear y mandar el embed con la información del usuario agregado
            const addUserEmbed = new EmbedBuilder()
                    .setDescription(`> El usuario ${userToAdd.tag} ha sido agreado al ticket`)
                    .setColor(0x3498db)
            await interaction.reply({ embeds: [addUserEmbed] });
        
        } catch (error) {
            console.error('Error adding user to ticket:', error);
            await interaction.reply({ content: 'Hubo un error al agregar el usuario al ticket.', ephemeral: true });
        }
    }
};
