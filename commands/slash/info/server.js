const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Muestra información del servidor'),

    async execute(interaction) {
        const guild = interaction.guild;

        // Obtener el propietario del servidor
        const owner = await guild.fetchOwner();
        // Obtener el server
        const server = interaction.guild;
        // Obtener el icono del server
        const serverIconURL = interaction.guild.iconURL({ dynamic: true });

        // Crear el embed
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setThumbnail(serverIconURL)
            .setTitle(`Información de ${server.name}`) 
            .addFields(
                { name: 'Propietario', value: `<@${owner.id}> 👑`, inline: true },
                { name: 'ID del Servidor', value: `${guild.id} 🆔`, inline: true },
                { name: 'Creado el', value: `${guild.createdAt.toDateString()} 📅`, inline: true },
                { name: 'Miembros', value: `${guild.memberCount} 👥`, inline: true },
                { name: 'Canales de Texto', value: `${guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size} 💬`, inline: true },
                { name: 'Canales de Voz', value: `${guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size} 🔊`, inline: true },
                { name: 'Boosts', value: `${guild.premiumSubscriptionCount} 💖`, inline: true },
                { name: 'Emojis', value: `${guild.emojis.cache.size} 😊`, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size} 💼`, inline: true },
                { name: 'Verificación', value: `${guild.verificationLevel} 🔒`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }); 

        // Responder con el embed
        await interaction.reply({ embeds: [embed] });
    },
};
