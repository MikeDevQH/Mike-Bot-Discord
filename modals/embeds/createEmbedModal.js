const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'createEmbedModal',
    async execute(interaction) {
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const thumbnail = interaction.fields.getTextInputValue('thumbnail');
        const image = interaction.fields.getTextInputValue('image');
        const footer = interaction.fields.getTextInputValue('footer');

        const channel = interaction.client.embedChannel;
        const color = interaction.client.embedColor;
        const serverName = interaction.client.serverName;
        const serverIcon = interaction.client.serverIcon;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setAuthor({ name: serverName, iconURL: serverIcon })
            .setFooter({ text: footer });

        if (thumbnail) embed.setThumbnail(thumbnail);
        if (image) embed.setImage(image);

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Embed creado con éxito!', ephemeral: true });
    }
};
