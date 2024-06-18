const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'discoveryButton',
    async execute(interaction) {
        const guild = interaction.guild; // Obteniendo el servidor
        const isDiscoverable = guild.features.includes('DISCOVERABLE');

        const serverIconURL = guild.iconURL({ dynamic: true, size: 4096 }); // Obteniendo el icono del servidor
        const bannerURL = guild.bannerURL({ size: 4096 }); // Obteniendo el banner del servidor
        const memberCount = guild.memberCount; // Obteniendo los miembros del servidor
        const onlineCount = guild.members.cache.filter(member => member.presence?.status === 'online').size; // Miembros online 
        const description = guild.description || 'No hay descripción disponible.'; // Obteniendo descripción del servidor
        const categories = guild.features.join(', '); // Obteniendo categorias del servidor

        // Embed para mostrar la información del descubrimiento
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`Información de Descubrimiento: ${guild.name}`)
            .setThumbnail(serverIconURL)
            .addFields(
                { name: 'Descripción', value: description, inline: false },
                { name: 'Categorías', value: categories, inline: true },
                { name: 'Miembros', value: `${memberCount} total, ${onlineCount} en línea`, inline: true }
            )
            .setImage(bannerURL)
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        if (!isDiscoverable) {
            return interaction.reply({ content: 'Este servidor no está habilitado para el descubrimiento.', ephemeral: true });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
