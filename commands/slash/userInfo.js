const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Este comando permite ver el perfil de un usuario mediante una imagen.')
        .addUserOption(option => option
            .setName('usuario')
            .setDescription('Elige al usuario que quieras ver el perfil.')
            .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const user = interaction.options.getUser('usuario') || interaction.user;
            const member = interaction.guild ? interaction.guild.members.cache.get(user.id) : null;

            if (!member) {
                return interaction.editReply('No se pudo obtener el miembro del servidor.');
            }

            const currentDate = new Date();
            const formattedDate = `${currentDate.toLocaleDateString()}`;

            // Fetch profile image using canvacord
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
            const rank = new canvacord.Rank()
                .setAvatar(avatarURL)
                .setBackground('IMAGE', 'https://i.imgur.com/AfFp7pu.png') // You can use a custom background image URL or local file path
                .setUsername(user.username)
                .setDiscriminator(user.discriminator)
                .setLevel(1) // Customize as needed
                .setRank(1, "RANK", false) // Customize as needed
                .setCurrentXP(1000) // Customize as needed
                .setRequiredXP(2000) // Customize as needed
                .setProgressBar('#FFFFFF', 'COLOR'); // Customize progress bar color

            const buffer = await rank.build();
            const attachment = new AttachmentBuilder(buffer, { name: 'profile-image.png' });

            // Fetch user profile to get banner
            const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setTitle(`INFORMACIÓN DE ${user.tag}`)
                .addFields(
                    { name: '🆔 Discord Id:', value: `${user.id}` },
                    { name: '🏷️ Apodo:', value: `${member.nickname || 'No tiene'}` },
                    { name: '🗒️ Mencion:', value: `<@${user.id}>` },
                    { name: '📅 Fecha de creación:', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)` },
                    { name: '➡️ Fecha de ingreso:', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)` },
                    { name: '📃 Roles:', value: `${member.roles.cache.map(role => `<@&${role.id}>`).join(' ')}` }
                )
                .setThumbnail(user.displayAvatarURL())
                .setImage('attachment://profile-image.png')
                .setFooter({ text: `Solicitado por: ${interaction.user.tag} • ${formattedDate}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('show_avatar')
                        .setLabel('🖼 Avatar')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('show_banner')
                        .setLabel('🖼 Banner')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('show_permissions')
                        .setLabel('🔐 Permisos')
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.editReply({ embeds: [embed], components: [row], files: [attachment] });

            const filter = i => (i.customId === 'show_permissions' || i.customId === 'show_avatar' || i.customId === 'show_banner') && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'show_permissions') {
                    const permissions = member.permissions.toArray();
                    const permissionList = permissions.length > 0
                        ? permissions.map(permission => `✅ ${permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}`).join('\n')
                        : 'No tiene permisos especiales.';

                    const permissionsEmbed = new EmbedBuilder()
                        .setColor('#3498db')
                        .setTitle(`Permisos de ${user.tag}`)
                        .setDescription(permissionList)
                        .setFooter({
                            iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
                            text: interaction.client.user.username
                        })
                        .setTimestamp();

                    await i.reply({ embeds: [permissionsEmbed], ephemeral: true });
                } else if (i.customId === 'show_avatar') {
                    const avatarEmbed = new EmbedBuilder()
                        .setColor('#3498db')
                        .setTitle(`Avatar de ${user.tag}`)
                        .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                        .setFooter({
                            iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
                            text: interaction.client.user.username
                        })
                        .setTimestamp();

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Ver en el navegador')
                                .setStyle(ButtonStyle.Link)
                                .setURL(avatarURL)
                        );

                    await i.reply({ embeds: [avatarEmbed], components: [row], ephemeral: true });
                } else if (i.customId === 'show_banner') {
                    const bannerURL = fetchedUser.bannerURL({ dynamic: true, size: 1024 });

                    if (bannerURL) {
                        const bannerEmbed = new EmbedBuilder()
                            .setColor('#3498db')
                            .setTitle(`Banner de ${user.tag}`)
                            .setImage(bannerURL)
                            .setFooter({
                                iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
                                text: interaction.client.user.username
                            })
                            .setTimestamp();

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel('Ver en el navegador')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(bannerURL)
                            );

                        await i.reply({ embeds: [bannerEmbed], components: [row], ephemeral: true });
                    } else {
                        const noBannerEmbed = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle(`Banner de ${user.tag}`)
                            .setDescription('El usuario no tiene banner.')
                            .setFooter({
                                iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
                                text: interaction.client.user.username
                            })
                            .setTimestamp();

                        await i.reply({ embeds: [noBannerEmbed], ephemeral: true });
                    }
                }
            });
        } catch (error) {
            console.error('Ocurrió un error:', error);
            await interaction.editReply('Ocurrió un error al ejecutar el comando.');
        }
    },
};
