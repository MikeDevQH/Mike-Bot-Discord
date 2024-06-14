const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia actual del bot y el tiempo en línea.'),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {

        const statusCircles = {
            excellent: '🟢',
            good: '🟡',
            poor: '🔴'
        };

        await interaction.deferReply();
        const replyMessage = await interaction.editReply({ content: 'Calculando latencia...' });
        const websocketPing = interaction.client.ws.ping;
        const apiLatency = Date.now() - replyMessage.createdTimestamp;

        const uptime = interaction.client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor((uptime % 86400000) / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);

        const websocketEmoji = websocketPing <= 100 ? statusCircles.excellent : websocketPing <= 200 ? statusCircles.good : statusCircles.poor;
        const apiLatencyEmoji = apiLatency <= 200 ? statusCircles.excellent : apiLatency <= 400 ? statusCircles.good : statusCircles.poor;

        const latencyEmbed = new EmbedBuilder()
            .setTitle('📡 Latencia del Bot')
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
            .setColor('#3498db')
            .addFields(
                { name: 'WebSocket', value: `${websocketEmoji} \`${websocketPing}ms\``, inline: true },
                { name: 'Latencia API', value: `${apiLatencyEmoji} \`${apiLatency}ms\``, inline: true },
                { name: 'Tiempo en línea', value: `⏳ \`${days}d ${hours}h ${minutes}m ${seconds}s\``, inline: false }
            )
            .setFooter({ text: 'Estado actual del bot' })
            .setTimestamp();

        await replyMessage.edit({ embeds: [latencyEmbed], content: '' });
    },
};