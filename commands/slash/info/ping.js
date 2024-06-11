const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Este comando permite ver la latencia del bot.'),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {

        let circles = {
            good: '🟢',
            okay: '🟡',
            bad: '🔴'
        }

        await interaction.deferReply();
        const pinging = await interaction.editReply({ content: 'Obteniendo latencia...' });
        const ws = interaction.client.ws.ping;
        const msgEdit = Date.now() - pinging.createdTimestamp;

        let days = Math.floor(interaction.client.uptime / 8640000);
        let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        let minutes = Math.floor(interaction.client.uptime / 60000) % 24;
        let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

        const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
        const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

        const pingEmbed = new EmbedBuilder()
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
            .setColor(0x3498db)
            .addFields(
                { name: 'Websocket', value: `${wsEmoji} \`${ws}ms\`` },
                { name: 'Latencia de la API', value: `${msgEmoji} \`${msgEdit}ms\`` },
                { name: 'Tiempo en línea', value: `🕐 \`${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos\`` }
            );

        await pinging.edit({ embeds: [pingEmbed], content: '\u200b' });

    },
};