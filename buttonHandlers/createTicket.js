const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

        const ticketEmbed = new EmbedBuilder()
            .setTitle('Nuevo Ticket')
            .setDescription('Por favor, describe tu problema con detalles. No etiquetes al staff.')
            .setColor(0x3498db);

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('claimTicket')
                .setLabel('Reclamar')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('closeTicket')
                .setLabel('Cerrar')
                .setStyle(ButtonStyle.Danger)
        );

        await ticketChannel.send({ embeds: [ticketEmbed], components: [actionRow] });

        await interaction.reply({ content: `Ticket creado: ${ticketChannel}`, ephemeral: true });
    }
};
