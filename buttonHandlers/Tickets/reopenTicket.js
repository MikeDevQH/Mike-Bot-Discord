const { PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const ticketConfigController = require('../../controllers/ticketConfigController');

module.exports = {
    id: 'reopenTicket',
    async execute(interaction) {
        const { member, channel, guild } = interaction;

        // Obtener la configuración de tickets desde la base de datos
        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        // Obtener el mensaje del embed
        const messages = await channel.messages.fetch({ limit: 100 });
        const ticketMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith('UserID:'));

        if (!ticketMessage) {
            await interaction.reply({ content: 'No se pudo encontrar el mensaje original del ticket.', ephemeral: true });
            return;
        }

        // Extraer el ID del usuario del footer del embed
        const originalMemberId = ticketMessage.embeds[0].footer.text.replace('UserID: ', '');

        // Obtener la categoría original desde el topic del canal
        const originalCategory = channel.topic;
        if (!originalCategory) {
            await interaction.reply({ content: 'No se pudo encontrar la categoría original del ticket.', ephemeral: true });
            return;
        }

        // Mover el canal a la categoría original
        await channel.setParent(originalCategory);

        // Restablecer permisos para el usuario original y el rol de staff
        await channel.permissionOverwrites.set([
            {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: originalMemberId,
                allow: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: config.staffRoleId,
                allow: [PermissionFlagsBits.ViewChannel],
            }
        ]);

        const reopenEmbed = new EmbedBuilder ()
                .setDescription(`> El ticket fue reabierto por <@${member.user.id}>`)
                .setColor(0x3498db)

        await interaction.reply({ embeds: [reopenEmbed] });
        await interaction.follow({ content:(`<@${originalMemberId}>`) })

        // Enviar embed al canal de logs
        const logChannelId = await ticketConfigController.getTicketLogChannel(guild.id);
        const logChannel = guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('Ticket Reabierto')
                .setDescription(`El ticket **${channel.name}** ha sido reabierto por ${member.user.tag}.`)
                .setColor('#00FF00');
            await logChannel.send({ embeds: [logEmbed] });
        }
    }
};
