const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getCaseNumber } = require('../../handlers/caseNumberHandler');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../data/data.json');
let data = require(dataPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutear temporalmente a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a mutear')
                .setRequired(true))
        
         .addStringOption(option =>
            option.setName('motivo')
                .setDescription('El motivo del mute')
                .setMinLength(3)
                .setMaxLength(100)
                .setRequired(true))
        
        .addStringOption(option =>
            option.setName('tiempo')
                .setDescription('El tiempo de mute (ej. 10s, 5m, 1h, 1d)')
                .setRequired(true)),

    async execute(interaction) {
        const member = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('motivo');
        const timeInput = interaction.options.getString('tiempo');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
        }

        if (!member.manageable) {
            return interaction.reply({ content: 'No puedo aislar a este usuario.', ephemeral: true });
        }

        const time = parseTime(timeInput);
        if (time === null) {
            return interaction.reply({ content: 'Formato de tiempo inválido. Usa s, m, h o d.', ephemeral: true });
        }

        try {
            const caseNumber = getCaseNumber('mute');
            await member.timeout(time, reason);
            const serverIconURL = interaction.guild.iconURL();
            const embed = new EmbedBuilder()
                .setTitle('Usuario Muteado')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) 
                .addFields(
                    { name: 'Usuario', value: `<@${member.id}>`, inline: true },
                    { name: 'Staff', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Razón', value: reason, inline: false },
                    { name: 'Tiempo', value: timeInput, inline: true},
                    { name: 'Caso', value: `#${caseNumber}`, inline: true }
                )
                .setColor(0xD93C40)
                .setFooter({ text: `${interaction.guild.name} `, iconURL: serverIconURL })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Enviar el embed al canal de registros si está configurado
            const modLogChannelId = data.modLogChannelId;
            if (modLogChannelId) {
                const logChannel = interaction.guild.channels.cache.get(modLogChannelId);
                if (logChannel) {
                    await logChannel.send({ embeds: [embed] });
                }
            }

            const dmEmbed = new EmbedBuilder()
                .setTitle('¡Has sido Sancionado!')
                .setDescription(`Has sido muteado de ${interaction.guild.name}.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) 
                .addFields(
                    { name: '🔇 Razón', value: reason, inline: false },
                    { name: '⏰ Tiempo', value: timeInput, inline: true }
                )
                .setColor(0xD93C40)
                .setFooter({ text: `${interaction.guild.name} `, iconURL: serverIconURL})
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] }).catch(err => {
                console.log('No se pudo enviar el mensaje directo al usuario.');
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Hubo un error al intentar aislar al usuario.', ephemeral: true });
        }
    },
};

function parseTime(input) {
    const match = input.match(/^(\d+)([smhd])$/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's':
            return value * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        default:
            return null;
    }
}
