const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ticketConfigController = require('../../controllers/ticketConfigController');

module.exports = {
    id: 'createTicket',
    async execute(interaction) {
        const { guild, member, client } = interaction;
        const serverIconURL = interaction.guild.iconURL({ dynamic: true }); 

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
            name: `${selectedCategory}-${member.user.username}`,
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
            .setDescription(`
                > ## 🎫 __Por favor ten en cuenta lo siguiente:__\n
                
                - 📝 Para que podamos ayudarte de la mejor manera, por favor describe lo que necesitas con la mayor cantidad de detalles posible.\n
                - ⏳ Ten en cuenta que podría haber una pequeña espera antes de ser atendido, pero no te preocupes, ¡estamos trabajando para resolver tu problema lo más rápido posible!\n
                - 🚫 Recuerda que no es necesario que etiquetes al staff. Una vez que envíes tu mensaje, un miembro del equipo de soporte se pondrá en contacto contigo lo antes posible.\n
                
                **🤝¡Gracias por tu paciencia y colaboración!🤝**`)
            .setThumbnail(serverIconURL)
            .setColor(0x3498db)
            .setFooter({ text: `UserID: ${member.id}` }); // Almacenar el ID del usuario en el footer del embed para utilizarlo luego

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('claimTicket')
                .setLabel('👋 Reclamar')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('closeTicket')
                .setLabel('🔒 Cerrar Ticket')
                .setStyle(ButtonStyle.Danger)
        );

        await ticketChannel.send({ content: `¡Hola, <@${member.id}> hemos creado este ticket para tí! <@&${config.staffRoleId}>`,embeds: [ticketEmbed], components: [actionRow] });
        await interaction.reply({ content: `Ticket creado: ${ticketChannel}`, ephemeral: true });

        // Enviar embed al canal de logs
        const logChannelId = await ticketConfigController.getTicketLogChannel(guild.id);
        const logChannel = guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Ticket Creado')
                .setDescription(`${member.user.username} ha creado un nuevo ticket en ${ticketChannel}`)
            await logChannel.send({ embeds: [logEmbed] });
        }
    }
};
