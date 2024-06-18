const { SlashCommandBuilder } = require('@discordjs/builders');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Crea y edita mensajes embebidos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Crea un nuevo embed')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('El color del embed en formato HEX (ej: #3498db)')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('El canal donde enviar el embed')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edita un embed existente')
                .addStringOption(option =>
                    option.setName('mensaje_id')
                        .setDescription('El ID del mensaje a editar')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('El color del embed en formato HEX (ej: #3498db)')
                        .setRequired(true))),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const color = interaction.options.getString('color');
        const mensajeId = interaction.options.getString('mensaje_id');
        const channel = interaction.options.getChannel('canal') || interaction.channel;

        if (subcommand === 'edit') {
            try {
                const message = await channel.messages.fetch(mensajeId);
                const embed = message.embeds[0];

                const modal = new ModalBuilder()
                    .setCustomId('editEmbedModal')
                    .setTitle('Editar Embed');

                const titleInput = new TextInputBuilder()
                    .setCustomId('title')
                    .setLabel('Título del Embed')
                    .setStyle(TextInputStyle.Short)
                    .setValue(embed.title || '')
                    .setRequired(false);

                const descriptionInput = new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel('Descripción del Embed')
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(embed.description || '')
                    .setRequired(false);

                const thumbnailInput = new TextInputBuilder()
                    .setCustomId('thumbnail')
                    .setLabel('URL del thumbnail')
                    .setStyle(TextInputStyle.Short)
                    .setValue(embed.thumbnail?.url || '')
                    .setRequired(false);

                const imageInput = new TextInputBuilder()
                    .setCustomId('image')
                    .setLabel('URL de la imagen principal')
                    .setStyle(TextInputStyle.Short)
                    .setValue(embed.image?.url || '')
                    .setRequired(false);

                const footerInput = new TextInputBuilder()
                    .setCustomId('footer')
                    .setLabel('Texto del pie de página')
                    .setStyle(TextInputStyle.Short)
                    .setValue(embed.footer?.text || '')
                    .setRequired(false);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(titleInput),
                    new ActionRowBuilder().addComponents(descriptionInput),
                    new ActionRowBuilder().addComponents(thumbnailInput),
                    new ActionRowBuilder().addComponents(imageInput),
                    new ActionRowBuilder().addComponents(footerInput)
                );

                await interaction.showModal(modal);

                // Guardar el canal, color, nombre e icono del servidor en la interacción para su uso posterior
                interaction.client.embedChannel = channel;
                interaction.client.embedColor = color;
                interaction.client.serverName = interaction.guild.name;
                interaction.client.serverIcon = interaction.guild.iconURL();
                interaction.client.messageId = mensajeId;
            } catch (error) {
                console.error('Error fetching message:', error);
                await interaction.reply({ content: 'No se pudo encontrar el mensaje con el ID proporcionado.', ephemeral: true });
            }
        } else {
            const modal = new ModalBuilder()
                .setCustomId('createEmbedModal')
                .setTitle('Crear Embed');

            const titleInput = new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Título del Embed')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const descriptionInput = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Descripción del Embed')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false);

            const thumbnailInput = new TextInputBuilder()
                .setCustomId('thumbnail')
                .setLabel('URL del thumbnail')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const imageInput = new TextInputBuilder()
                .setCustomId('image')
                .setLabel('URL de la imagen principal')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const footerInput = new TextInputBuilder()
                .setCustomId('footer')
                .setLabel('Texto del pie de página')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descriptionInput),
                new ActionRowBuilder().addComponents(thumbnailInput),
                new ActionRowBuilder().addComponents(imageInput),
                new ActionRowBuilder().addComponents(footerInput)
            );

            await interaction.showModal(modal);

            // Guardar el canal, color, nombre e icono del servidor en la interacción para su uso posterior
            interaction.client.embedChannel = channel;
            interaction.client.embedColor = color;
            interaction.client.serverName = interaction.guild.name;
            interaction.client.serverIcon = interaction.guild.iconURL();
        }
    },
};
