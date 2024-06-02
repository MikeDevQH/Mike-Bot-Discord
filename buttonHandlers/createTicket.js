const { ChannelType, PermissionFlagsBits } = require('discord.js');
const ticketConfigController = require('../controllers/ticketConfigController');

module.exports = {
    id: 'createTicket',
    async execute(interaction) {
        const { guild, member, client } = interaction;

        // Obtener la configuración de tickets desde la base de datos
        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        // Obtener la categoría seleccionada desde la propiedad del cliente
        const selectedCategory = client.selectedCategory;

        if (!selectedCategory) {
            await interaction.reply({ content: 'Por favor selecciona una categoría antes de crear un ticket.', ephemeral: true });
            return;
        }

        // Crear el ticket en la categoría seleccionada
        const categoryChannel = guild.channels.cache.find(channel => channel.name === selectedCategory && channel.type === ChannelType.GuildCategory);
        if (!categoryChannel) {
            await interaction.reply({ content: `No se encontró la categoría seleccionada: ${selectedCategory}`, ephemeral: true });
            return;
        }

        const ticketChannel = await guild.channels.create({
            name: `ticket-${member.user.username}`,
            type: ChannelType.GuildText,
            parent: categoryChannel.id,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: member.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: config.staffRoleId,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
            ]
        });

        await interaction.reply({ content: `Ticket creado: ${ticketChannel}`, ephemeral: true });
    }
};
