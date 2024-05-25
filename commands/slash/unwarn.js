const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../data/data.json');

let data = require(dataPath);

const removeWarning = (userId) => {
    if (data.warnings[userId]) {
        data.warnings[userId] -= 1; 
        if (data.warnings[userId] <= 0) {
            delete data.warnings[userId]; 
        }
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true; 
    }
    return false; 
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Retira una advertencia a un usuario del servidor.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a retirarle la advertencia.')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        const success = removeWarning(user.id);

        if (success) {
            const warningCount = data.warnings[user.id] || 0; // Obtenemos el número de advertencias del usuario

            const serverIconURL = interaction.guild.iconURL();
            const embed = new EmbedBuilder()
                .setTitle('Advertencia Retirada')
                .setColor(0x01DD7B)
                .setThumbnail(user.displayAvatarURL({ dynamic: true })) 
                .addFields(
                    { name: 'Usuario', value: `<@${user.id}>`, inline: true },
                    { name: 'Staff', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Advertencias', value: warningCount.toString(), inline: true }, // Mostramos el número de advertencias
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            const dmEmbed = new EmbedBuilder()
                .setTitle('Advertencia Retirada')
                .setDescription(`Se te ha retirado una advertencia en ${interaction.guild.name}.`)
                .setColor(0x01DD7B)
                .setThumbnail(user.displayAvatarURL({ dynamic: true })) 
                .addFields(
                    { name: '👮‍♂️ Staff', value: `<@${interaction.user.id}>`, inline: false },
                    { name: '⚠️ Advertencias', value: warningCount.toString(), inline: true },
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(err => {
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
        } else {
            await interaction.reply({ content: `El usuario ${user.username} no tiene advertencias que retirar.`, ephemeral: true });
        }
    },
};
