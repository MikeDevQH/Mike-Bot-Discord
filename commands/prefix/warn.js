const { PermissionsBitField, EmbedBuilder, EmbedType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getCaseNumber } = require('../../handlers/caseNumberHandler');

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
    name: 'warn',
    description: 'Da una advertencia a un usuario del servidor.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('No tienes permiso para ejecutar este comando.');
        }

        const embed = new EmbedBuilder()
                .setTitle('¡Usa el formato correcto!')
                .setDescription('`.warn @usuario motivo`')
                .setColor('#3498db');
        const user = message.mentions.users.first();
        const reason = args.slice(1).join(' ');

        if (!user || !reason) {
            return message.reply({ embeds: [embed] });
        }

        const member = message.guild.members.cache.get(user.id);
        if (member) {
            try {
                const caseNumber = getCaseNumber('warn');
                const warningCount = addWarning(user.id);
                const serverIconURL = message.guild.iconURL();

                const embed1 = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setDescription(`¡${user.toString()} ha sido advertido!`)
                    .addFields(
                        { name: 'Motivo', value: reason, inline: false },
                    )
                    .setFooter({ text: `Advertencias: ${warningCount}`})
                

                const embed2 = new EmbedBuilder()
                    .setTitle('Usuario Advertido')
                    .setColor(0xFFA500)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Usuario', value: `<@${user.id}>`, inline: true },
                        { name: 'Staff', value: `<@${message.author.id}>`, inline: true },
                        { name: 'Motivo', value: reason, inline: false },
                        { name: 'Caso', value: `#${caseNumber}`, inline: true },
                        { name: 'Advertencias', value: warningCount.toString(), inline: true }
                    )
                    .setFooter({ text: `${message.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp();

                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('¡Has recibido una Advertencia!')
                            .setColor(0xFFA500)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: '🚨 Motivo', value: reason, inline: false },
                                { name: '📝 Caso', value: `#${caseNumber}`, inline: true },
                                { name: '⚠️ Advertencias', value: warningCount.toString(), inline: true }
                            )
                            .setFooter({ text: `${message.guild.name}`, iconURL: serverIconURL })
                            .setTimestamp()
                    ]
                }).catch(console.error);

                await message.channel.send({ embeds: [embed1] });

                const modLogChannelId = data.modLogChannelId;
                if (modLogChannelId) {
                    const logChannel = message.guild.channels.cache.get(modLogChannelId);
                    if (logChannel) {
                        await logChannel.send({ embeds: [embed2] });
                    } else {
                        console.error('No se pudo encontrar el canal de registros de moderación.');
                    }
                } else {
                    console.error('El canal de registros de moderación no está configurado.');
                }
            } catch (error) {
                console.error(error);
                message.reply('¡Hubo un error al ejecutar este comando!');
            }
        } else {
            message.reply('Ese usuario no está en este servidor.');
        }
    },
};
