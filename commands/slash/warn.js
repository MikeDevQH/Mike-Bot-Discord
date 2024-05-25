// En el archivo warn.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { getCaseNumber } = require('../../handlers/caseNumberHandler');
const { wrap } = require('module');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../data/data.json');

let data = require(dataPath);

const addWarning = (userId) => {
    if (!data.warnings[userId]) {
        data.warnings[userId] = 1;
    } else {
        data.warnings[userId] += 1;
    }
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return data.warnings[userId];
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Da una advertencia a un usuario del servidor.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a advertir.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Razón para advertir al usuario.')
                .setMinLength(3)
                .setMaxLength(100)
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            await interaction.deferReply({ ephemeral: true });

            try {
                const caseNumber = getCaseNumber('warn');
                const warningCount = addWarning(user.id);
                const serverIconURL = interaction.guild.iconURL();

                const embed = new EmbedBuilder()
                .setTitle('Usuario Advertido')
                .setColor(0xFFA500)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Usuario', value: `<@${user.id}>`, inline: true },
                    { name: 'Staff', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Razón', value: reason, inline: false },
                    { name: 'Caso', value: `#${caseNumber}`, inline: true },
                    { name: 'Advertencias', value: warningCount.toString(), inline: true }
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                .setTimestamp();
            

                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('¡Has recibido una Advertencia!')
                            .setColor(0xFFA500)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: '🚨 Razón', value: reason, inline: false },
                                { name: '📝 Caso', value: `#${caseNumber}`, inline: true },
                                { name: '⚠️ Advertencias', value: warningCount.toString(), inline: true }
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                            .setTimestamp()
                    ]
                }).catch(console.error);

                await interaction.editReply({ embeds: [embed], ephemeral: false });

                // Obtener el ID del canal de registros de moderación
                const modLogChannelId = data.modLogChannelId;
                if (modLogChannelId) {
                    const logChannel = interaction.guild.channels.cache.get(modLogChannelId);
                    if (logChannel) {
                        await logChannel.send({ embeds: [embed] });
                    } else {
                        console.error('No se pudo encontrar el canal de registros de moderación.');
                    }
                } else {
                    console.error('El canal de registros de moderación no está configurado.');
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
