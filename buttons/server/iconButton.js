const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: 'iconButton',
    async execute(interaction) {
        const guild = interaction.guild; // Obteniendo el servidor
        const iconURL = guild.iconURL({ dynamic: true, size: 4096 }); // Obteniendo el incono del servidor
        if (!iconURL) {
            return interaction.reply({ content: 'Este servidor no tiene un icono.', ephemeral: true });
        }

        // Contruir el embed para mostrar el icono del servidor
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`Icono del servidor: ${guild.name}`)
            .setImage(iconURL)
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Añadir botón para mostrar el incono en el navegador
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ver en el navegador')
                    .setStyle(ButtonStyle.Link)
                    .setURL(iconURL)
            );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
};
