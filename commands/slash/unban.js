const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../data/data.json');
let data = require(dataPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Desbanear a un usuario del servidor.')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('El ID del usuario a desbanear.')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        try {
            // Verificar si el usuario está baneado
            const banList = await interaction.guild.bans.fetch();
            const userBan = banList.find(ban => ban.user.id === userId);

            if (!userBan) {
                return interaction.reply({ content: `El usuario con ID ${userId} no está baneado.`, ephemeral: true });
            }

            const user = await interaction.client.users.fetch(userId);
            const serverIconURL = interaction.guild.iconURL();

            await interaction.guild.members.unban(userId);

            const unbanEmbed = new EmbedBuilder()
                .setColor(0x01DD7B)
                .setTitle('Usuario Desbaneado')
                .setThumbnail(user.displayAvatarURL({ dynamic: true })) 
                .addFields(
                    { name: '👤 ID', value: userId, inline: false },
                    { name: '👮‍♂️ Staff', value: `<@${interaction.user.id}>`, inline: false },
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                .setTimestamp();

            await interaction.reply({ embeds: [unbanEmbed], ephemeral: true });

            // Enviar un mensaje directo al usuario desbaneado con los detalles de la sanción
            const dmEmbed = new EmbedBuilder()
                .setTitle('Sanción Removida')
                .setDescription(`Has sido desbaneado de ${interaction.guild.name}.`)
                .setColor(0x01DD7B)
                .setThumbnail(user.displayAvatarURL({ dynamic: true })) 
                .setFields(
                    { name: '👮‍♂️ Staff', value: `<@${interaction.user.id}>`, inline: false },
                )
                .setFooter({ text: interaction.guild.name, iconURL: serverIconURL })
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(err => {
                console.log('No se pudo enviar el mensaje directo al usuario.');
            });

            // Enviar el embed al canal de registros si está configurado
            const modLogChannelId = data.modLogChannelId;
            if (modLogChannelId) {
                const logChannel = interaction.guild.channels.cache.get(modLogChannelId);
                if (logChannel) {
                    await logChannel.send({ embeds: [unbanEmbed] });
                }
            }
        } catch (error) {
            console.error('Error al desbanear usuario:', error);
            await interaction.reply({ content: `No se pudo desbanear al usuario con ID ${userId}. Por favor, asegúrate de que el ID sea correcto y el usuario esté baneado.`, ephemeral: true });
        }
    },
};
