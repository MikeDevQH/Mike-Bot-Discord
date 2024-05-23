const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../data.json');
let data = require(dataPath);

const getCaseNumber = () => {
    data.banCaseCount += 1;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return data.banCaseCount;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario del servidor.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a banear.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Razón para banear al usuario.')
                .setMinLength(3)
                .setMaxLength(100)
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        try {
            const banInfo = await interaction.guild.bans.fetch(user.id);
            if (banInfo) {
                return interaction.reply({ content: 'Ese usuario ya está baneado.', ephemeral: true });
            }
        } catch (error) {
            if (error.code !== 10026) {
                console.error('Error al verificar el estado de baneo del usuario:', error);
                return interaction.reply({ content: 'Hubo un error al verificar el estado de baneo del usuario.', ephemeral: true });
            }
        }

        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            await interaction.deferReply({ephemeral: true});

            try {
                const caseNumber = getCaseNumber();
                const serverIconURL = interaction.guild.iconURL({ dynamic: true });

                const embed = new EmbedBuilder()
                    .setTitle('Usuario Baneado')
                    .setColor(0xD93C40)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Usuario', value: `<@${user.id}>`, inline: true },
                        { name: 'Staff', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Razón', value: reason, inline: false },
                        { name: 'Caso', value: `#${caseNumber}`, inline: true }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp();

                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('¡Has sido Sancionado!')
                            .setDescription(`Has sido baneado de ${interaction.guild.name}.`)
                            .setColor(0xD93C40)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: '🚫 Razón', value: reason, inline: false },
                                { name: '📝 Caso', value: `#${caseNumber}`, inline: true }
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                            .setTimestamp()
                    ]
                }).catch(console.error);

                await member.ban({ reason }).catch(console.error);

                await interaction.editReply({ embeds: [embed] });

                // Enviar el embed al canal de registros si está configurado
                const modLogChannelId = data.modLogChannelId;
                if (modLogChannelId) {
                    const logChannel = interaction.guild.channels.cache.get(modLogChannelId);
                    if (logChannel) {
                        await logChannel.send({ embeds: [embed] });
                    } else {
                        console.error('No se pudo enconrar el canal de registros de moderacion')
                    }
                }
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Ese usuario no está en este servidor.', ephemeral: true });
        }
    },
};
