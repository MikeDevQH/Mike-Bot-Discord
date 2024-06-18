const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'editEmbedModal',
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
        const messageId = interaction.client.messageId;

        try {
            const message = await channel.messages.fetch(messageId);

            const embed = new EmbedBuilder(message.embeds[0])
                .setColor(color)
                .setTitle(title || message.embeds[0].title)
                .setDescription(description || message.embeds[0].description)
                .setAuthor({ name: serverName, iconURL: serverIcon })
                .setFooter({ text: footer || message.embeds[0].footer?.text });

            if (thumbnail) embed.setThumbnail(thumbnail);
            if (image) embed.setImage(image);

            await message.edit({ embeds: [embed] });
            await interaction.reply({ content: 'Embed editado con éxito!', ephemeral: true });
        } catch (error) {
            console.error('Error editando el embed:', error);
            await interaction.reply({ content: 'No se pudo editar el embed. Asegúrate de que el ID del mensaje es correcto y que el mensaje está en el canal especificado.', ephemeral: true });
        }
    }
};
