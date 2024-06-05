const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../../data/data.json');
let data = require(dataPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Desmutear a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a desmutear')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('usuario');

        // Verifica si el usuario tiene permisos para quitar el aislamiento temporal
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
        }

        if (!member.manageable) {
            return interaction.reply({ content: 'No puedo desmutear a este usuario.', ephemeral: true });
        }

        try {
            await member.timeout(null); 
            const serverIconURL = interaction.guild.iconURL();
            const embed = new EmbedBuilder()
                .setTitle('Usuario Desmuteado')
                .setFields(
                { name: '👤 Usuario', value: `<@${member.id}>`, inline: true },
                { name: '👮‍♂️ Staff', value: `<@${interaction.user.id}>`, inline: true },
            )

                .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) 
                .setColor(0x01DD7B)
                .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            const dmEmbed = new EmbedBuilder()
                .setTitle('Sanción Removida')
                .setDescription(`Has sido desmuteado de ${interaction.guild.name}.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) 
                .setColor(0x01DD7B)
                .setFields(
                    { name: '👮‍♂️ Staff', value: `<@${interaction.user.id}>`, inline: false },
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] }).catch(err => {
                console.log('No se pudo enviar el mensaje directo al usuario.');
            });

            // Enviar el embed al canal de registros si está configurado
            const modLogChannelId = data.modLogChannelId;
            if (modLogChannelId) {
                const logChannel = interaction.guild.channels.cache.get(modLogChannelId);
                if (logChannel && logChannel.isTextBased()) { // Verifica si el canal es de texto
                    await logChannel.send({ embeds: [embed] }).catch(err => {
                        console.error('No se pudo enviar el embed al canal de registros:', err);
                    });
                } else {
                    console.log('El canal de registros configurado no es de texto o no existe.');
                }
            } else {
                console.log('No se ha configurado el ID del canal de registros.');
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Hubo un error al intentar desaislar al usuario.', ephemeral: true });
        }
    },
};
