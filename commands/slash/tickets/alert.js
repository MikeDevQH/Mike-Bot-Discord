const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ticketConfigController = require('../../../controllers/ticketConfigController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alert')
        .setDescription('Avisa que un ticket puede ser cerrado por inactividad'),

    async execute(interaction) {
        const { member, channel, guild } = interaction;

        // Obtener la configuración de tickets desde la base de datos
        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        // Verificar si el canal está en alguna de las categorías de tickets configuradas
        if (!channel.parent || !config.categoryNames.includes(channel.parent.name)) {
            await interaction.reply({ content: 'Este comando solo puede usarse en canales de tickets.', ephemeral: true });
            return;
        }

        // Verificar si el usuario tiene el rol de staff
        if (!member.roles.cache.has(config.staffRoleId)) {
            await interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
            return;
        }

         // Obtener el mensaje del embed
        const messages = await channel.messages.fetch({ limit: 100 });
        const ticketMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith('UserID:'));

        if (!ticketMessage) {
            await interaction.reply({ content: 'No se pudo encontrar el usuario.', ephemeral: true });
            return;
        }

         // Extraer el ID del usuario del footer del embed
         const originalMemberId = ticketMessage.embeds[0].footer.text.replace('UserID: ', '');

        // Construir y mandar el embed de alerta de inactividad del ticket
        const alertEmbed = new EmbedBuilder()
            .setDescription('> ¡El ticket será cerrado por inactividad si no recibe respuesta!')
            .setColor(0x3498db);
        await interaction.reply({ embeds: [alertEmbed] });
        await channel.send(`<@${originalMemberId}>`)
    }
};
