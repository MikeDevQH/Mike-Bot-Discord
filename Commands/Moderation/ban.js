const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta del archivo data.json para almacenar el número de casos de baneos
const dataPath = path.resolve(__dirname, '../../data.json');
let data = require(dataPath);

// Función para obtener y aumentar el número de casos de baneos
const getCaseNumber = () => {
    data.banCaseCount += 1;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return data.banCaseCount;
};

module.exports = {
    // Definir el comando 'ban' con su descripción y opciones
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

    // Función asíncrona que se ejecuta cuando se utiliza el comando
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');

        // Verificar si el miembro que ejecuta el comando tiene permisos para banear
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        // Verificar si el usuario ya está baneado
        try {
            const banInfo = await interaction.guild.bans.fetch(user.id);
            if (banInfo) {
                return interaction.reply({ content: 'Ese usuario ya está baneado.', ephemeral: true });
            }
        } catch (error) {
            // Ignorar el error si el usuario no está baneado (código de error 10026)
            if (error.code !== 10026) {
                console.error('Error al verificar el estado de baneo del usuario:', error);
                return interaction.reply({ content: 'Hubo un error al verificar el estado de baneo del usuario.', ephemeral: true });
            }
        }

        const member = interaction.guild.members.cache.get(user.id); // Obtener el miembro del servidor
        if (member) {
            await interaction.deferReply(); // Aplazar la respuesta para dar más tiempo

            try {
                const caseNumber = getCaseNumber(); // Obtener el número de caso de baneo
                const serverIconURL = interaction.guild.iconURL({ dynamic: true }); // Obtener la URL del icono del servidor

                // Crear el embed para el mensaje de baneo
                const embed = new EmbedBuilder()
                    .setTitle('Usuario Sancionado')
                    .setDescription(`<@${member.id}> ha sido baneado`)
                    .setColor(0xD93C40)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true })) // Añadir la foto de perfil del usuario
                    .addFields(
                        { name: 'Razón', value: reason, inline: true },
                        { name: 'Caso', value: `#${caseNumber}`, inline: true }
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
                                { name: '🚫 Razón', value: reason, inline: true },
                                { name: '📝 Caso', value: `#${caseNumber}`, inline: true }
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                            .setTimestamp()
                    ]
                }).catch(console.error);

                // Banear al usuario del servidor
                await member.ban({ reason }).catch(console.error);

                // Editar la respuesta de la interacción con el embed de baneo
                await interaction.editReply({ embeds: [embed] });
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
