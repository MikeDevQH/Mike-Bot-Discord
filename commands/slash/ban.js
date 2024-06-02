const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const path = require('path');
const { getCaseNumber } = require('../../handlers/caseNumberHandler');
const data = require('../../data/data.json');

module.exports = {
    // Definir el comando 'ban' con su descripción y una opción de usuario
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario del servidor.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a banear.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo para banear al usuario.')
                .setMinLength(3)
                .setMaxLength(100)
                .setRequired(true)),

    async execute(interaction) {
        // Obtener el usuario y motivo seleccionado
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');

        // Verificar si el miembro que ejecuta el comando tiene permisos para banear
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
            await interaction.deferReply({ ephemeral: true });

            try {
                const caseNumber = getCaseNumber('ban');
                const serverIconURL = interaction.guild.iconURL({ dynamic: true });

                 // Crear un Embed para el mensaje de sanción
                const embed = new EmbedBuilder()
                    .setTitle('Usuario Baneado')
                    .setColor(0xD93C40)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: '👤 Usuario', value: `<@${user.id}>`, inline: true },
                        { name: '👮‍♂️ Staff', value: `<@${interaction.user.id}>`, inline: true },
                        { name: '🚫 Motivo', value: reason, inline: false },
                        { name: '📝 Caso', value: `#${caseNumber}`, inline: true }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp();

                    // Enviar un mensaje al usuario baneado
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('¡Has sido Sancionado!')
                            .setDescription(`Has sido baneado de ${interaction.guild.name}.`)
                            .setColor(0xD93C40)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: '🚫 Motivo', value: reason, inline: false },
                                { name: '👮‍♂️ Staff', value: `<@${interaction.user.id}>`, inline: true },
                                { name: '📝 Caso', value: `#${caseNumber}`, inline: true }
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                            .setTimestamp()
                    ]
                }).catch(console.error);

                // Banear al usuario del servidor
                await member.ban({ reason }).catch(console.error);


                await interaction.editReply({ embeds: [embed] });

                // Enviar el embed al canal de registros si está configurado
                const modLogChannelId = data.modLogChannelId;
                if (modLogChannelId) {
                    const logChannel = interaction.guild.channels.cache.get(modLogChannelId);
                    if (logChannel) {
                        await logChannel.send({ embeds: [embed] });
                    } else {
                        console.error('No se pudo encontrar el canal de registros de moderación.');
                    }
                }
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
            }
        } else {
            // Responder si el usuario no está en el servidor
            await interaction.reply({ content: 'Ese usuario no está en este servidor.', ephemeral: true });
        }
    },
};
