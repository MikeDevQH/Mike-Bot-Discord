const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const ticketConfigController = require('../../../controllers/ticketConfigController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setticketconfig')
        .setDescription('Configura el sistema de tickets.')
        .addRoleOption(option => 
            option.setName('staffrole')
                .setDescription('El rol que tendrá permisos para manejar tickets.')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('logchannel')
                .setDescription('El canal donde se registrarán los logs de los tickets.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option => 
            option.setName('ticketchannel')
                .setDescription('El canal donde los usuarios podrán crear tickets.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option => 
            option.setName('categories')
                .setDescription('Los nombres de las categorías, separados por comas. Máximo 5 categorías.')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const server = interaction.guild;
        const serverIconURL = interaction.guild.iconURL({ dynamic: true }); 
        const staffRole = interaction.options.getRole('staffrole');
        const logChannel = interaction.options.getChannel('logchannel');
        const ticketChannel = interaction.options.getChannel('ticketchannel');
        const categoriesInput = interaction.options.getString('categories');

        const categoryNames = categoriesInput.split(',').map(name => name.trim()).slice(0, 5); // Limita a 5 categorías

        const config = {
            guildId: interaction.guild.id,
            staffRoleId: staffRole.id,
            logChannelId: logChannel.id,
            ticketChannelId: ticketChannel.id,
            categoryNames: categoryNames
        };

        // Guardar configuración en la base de datos
        try {
            await ticketConfigController.setTicketConfig(config);
        } catch (error) {
            console.error('Error saving ticket configuration:', error);
            await interaction.editReply({ content: 'Hubo un error al guardar la configuración.', ephemeral: true });
            return;
        }

        const createdCategories = [];

        for (const name of categoryNames) {
            try {
                const category = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildCategory, 
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: staffRole.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                    ]
                });
                createdCategories.push(category);
            } catch (error) {
                console.error(`Error creating category ${name}:`, error);
                await interaction.editReply({ content: `Hubo un error al crear la categoría ${name}.`, ephemeral: true });
                return;
            }
        }

        // Crear la categoría "Cerrados" si no existe
        let closedCategory = interaction.guild.channels.cache.find(channel => channel.name === 'Cerrados' && channel.type === ChannelType.GuildCategory);
        if (!closedCategory) {
            closedCategory = await interaction.guild.channels.create({
                name: 'Cerrados',
                type: ChannelType.GuildCategory,
                position: interaction.guild.channels.cache.size // Posicionar al final
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('Configuración del Sistema de Tickets')
            .setColor(0x3498db)
            .setDescription('La configuración del sistema de tickets ha sido actualizada.')
            .addFields(
                { name: 'Rol del Staff', value: `<@&${staffRole.id}>`, inline: false },
                { name: 'Canal de Logs', value: `<#${logChannel.id}>`, inline: false },
                { name: 'Canal de Creación de Tickets', value: `<#${ticketChannel.id}>`, inline: false },
                { name: 'Categorías de Tickets', value: categoryNames.join(', '), inline: false },
                { name: 'Categoría de Cerrados', value: 'Cerrados', inline: false }
            );

        await interaction.editReply({ embeds: [embed] });

        // Crear el embed para el canal de creación de tickets
        const ticketEmbed = new EmbedBuilder()
        .setTitle('🎟️ CREAR UN TICKET PARA RECIBIR SOPORTE 🎟️')
        .setColor(0x3498db)
        .setDescription(`¡Bienvenido al servidor **${server.name}**! 🎉\n
> Estamos aquí para ayudarte con cualquier problema o duda que puedas tener. En este canal, puedes crear un ticket de soporte para recibir la asistencia que necesitas.\n
## **¿Qué es un ticket?**\n
📄 Un ticket es una forma de contactar directamente con nuestro equipo de soporte. Te permitirá describir tu problema o pregunta para que podamos ayudarte de la mejor manera posible.\n
## **Cómo recibir soporte:**\n
1️⃣ Selecciona la categoría que mejor se asemeje a tu problema en el menú de abajo.\n
2️⃣ Nuestro equipo de soporte te atenderá lo antes posible.\n\n
**⚠️ __Abusar de este medio o darle un mal uso conllevará una sanción.__ ⚠️**`)
        .setThumbnail(serverIconURL)
        .setFooter({ text: `Equipo Administrativo de ${server.name}`, iconURL: serverIconURL })

        // Crear el menú desplegable de selección de categoría
        const categorySelectMenu = new StringSelectMenuBuilder()
            .setCustomId('selectCategory')
            .setPlaceholder('🌟 Elige tu categoría de soporte')
            .addOptions(categoryNames.map(category => ({
                label: category,
                value: category
            })));

        // Crear el botón de creación de ticket
        const createTicketButton = new ButtonBuilder()
            .setCustomId('createTicket')
            .setLabel('Crear Ticket')
            .setStyle(ButtonStyle.Primary);

        // Crear las filas de componentes
        const selectMenuRow = new ActionRowBuilder().addComponents(categorySelectMenu);
        const buttonRow = new ActionRowBuilder().addComponents(createTicketButton);

        // Enviar el embed al canal de creación de tickets con el menú desplegable y el botón
        try {
            await ticketChannel.send({ embeds: [ticketEmbed], components: [selectMenuRow, buttonRow] });
        } catch (error) {
            console.error('Error sending ticket creation message:', error);
            await interaction.editReply({ content: 'Hubo un error al enviar el mensaje de creación de tickets.', ephemeral: true });
        }
    }
};
