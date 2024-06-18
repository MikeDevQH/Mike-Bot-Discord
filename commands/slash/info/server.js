const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildExplicitContentFilter, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Comandos para verificar la información del servidor')
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Muestra información del servidor'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('icon')
                .setDescription('Muestra el icono del servidor'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('banner')
                .setDescription('Muestra el banner del servidor'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('descubrimiento')
                .setDescription('Muestra la información de descubrimiento del servidor')),
    async execute(interaction) {
        const { guild, options, client } = interaction;
        const subcommand = options.getSubcommand();

        if (subcommand === 'info') {
            let owner;
            try {
                owner = await guild.fetchOwner();
            } catch (error) {
                console.error('Error al obtener el propietario del servidor:', error);
                return interaction.reply({ content: 'No se pudo obtener la información del propietario del servidor.', ephemeral: true });
            }

            const onlineMembers = guild.members.cache.filter((member) => member.presence?.status === 'online');
            const { channels, roles } = guild;
            const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
            const userRoles = sortedRoles.filter(role => !role.managed);
            const managedRoles = sortedRoles.filter(role => role.managed);
            const boosterCount = guild.members.cache.filter(member => member.roles.cache.has('1249987041467301889')).size;

            const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
                let totalLength = 0;
                const result = [];

                for (const role of roles) {
                    const roleString = `<@&${role.id}>`;

                    if (roleString.length + totalLength > maxFieldLength) break;

                    totalLength += roleString.length + 1;
                    result.push(roleString);
                }

                return result.length;
            };

            const allRolesCount = roles.cache.size - 1;
            const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
            const totalChannels = getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum]);
            const verificationLevelMap = {
                [GuildExplicitContentFilter.Disabled]: 'Low',
                [GuildExplicitContentFilter.MembersWithoutRoles]: 'Medium',
                [GuildExplicitContentFilter.AllMembers]: 'Hard',
            };
            const verificationLevel = verificationLevelMap[guild.explicitContentFilter] || 'Unknown';

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .addFields(
                    { name: '👑 Propietario', value: `└ <@${owner.id}>`, inline: true },
                    { name: '🆔 ID del Servidor', value: `└ ${guild.id}`, inline: true },
                    { name: '📅 Fecha de creación', value: `└ <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: `👥 Miembros (${guild.memberCount})`, value: `└ **${onlineMembers.size}** Online ✅\n└ **${boosterCount}** Boosters 💜`, inline: true },
                    { name: `💬 Canales (${totalChannels})`, value: `└ **${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}** Texto\n└ **${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}** Voz`, inline: true },
                    { name: `🔒 Verificación`, value: `└ Nivel: **${verificationLevel}**`, inline: true },
                    { name: `💼 Roles (${allRolesCount})`, value: `└ **${maxDisplayRoles(userRoles)}** Normal roles\n└ **${maxDisplayRoles(managedRoles)}** Admin roles` }
                )
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            const iconButton = new ButtonBuilder()
                .setLabel('Icono')
                .setCustomId('iconButton')
                .setStyle(ButtonStyle.Primary);

            const bannerButton = new ButtonBuilder()
                .setLabel('Banner')
                .setCustomId('bannerButton')
                .setStyle(ButtonStyle.Primary);

            const discoveryButton = new ButtonBuilder()
                .setLabel('Descubrimiento')
                .setCustomId('discoveryButton')
                .setStyle(ButtonStyle.Primary);

            const actionRow = new ActionRowBuilder()
                .addComponents(iconButton, bannerButton, discoveryButton);

            await interaction.reply({ embeds: [embed], components: [actionRow] });
        } else if (subcommand === 'icon') {
            // Código para el subcomando icon
            const iconURL = guild.iconURL({ dynamic: true, size: 4096 });
            if (!iconURL) {
                return interaction.reply({ content: 'Este servidor no tiene un icono.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(`Icono del servidor: ${guild.name}`)
                .setImage(iconURL)
                .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'banner') {
            // Código para el subcomando banner
            const bannerURL = guild.bannerURL({ dynamic: true, size: 4096 });
            if (!bannerURL) {
                return interaction.reply({ content: 'Este servidor no tiene un banner.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(`Banner del servidor: ${guild.name}`)
                .setImage(bannerURL)
                .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'descubrimiento') {
            // Código para el subcomando descubrimiento
            const isDiscoverable = guild.features.includes('DISCOVERABLE');

            // Variables para la información del servidor
            const serverIconURL = guild.iconURL({ dynamic: true, size: 4096 });
            const bannerURL = guild.bannerURL({ size: 4096 });
            const memberCount = guild.memberCount;
            const onlineCount = guild.members.cache.filter(member => member.presence?.status === 'online').size;
            const description = guild.description || 'No hay descripción disponible.';
            const categories = guild.features.join(', ');

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
;
            }

            await interaction.reply({ embeds: [embed] });
        }
    },
};
