const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: 'bannerButton',
    async execute(interaction) {
        const guild = interaction.guild; // Obteniendo el servidor
        const bannerURL = guild.bannerURL({ dynamic: true, size: 4096 }); // Obteniendo el banner del servidor

        if (!bannerURL) {
            return interaction.reply({ content: 'Este servidor no tiene un banner.', ephemeral: true });
        }

        // Contruir el embed para mostrar el banner del servidor
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`Banner del servidor: ${guild.name}`)
            .setImage(bannerURL)
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Añadir botón para mostrar el banner en el navegador
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ver en el navegador')
                    .setStyle(ButtonStyle.Link)
                    .setURL(bannerURL)
            );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
};
