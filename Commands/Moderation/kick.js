const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta del archivo data.json para almacenar el número de casos de expulsiones
const dataPath = path.resolve(__dirname, '../../data.json');
let data = require(dataPath);

// Función para obtener y aumentar el número de casos de expulsiones
const getCaseNumber = () => {
    data.kickCaseCount += 1;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return data.kickCaseCount;
};

module.exports = {
    // Definir el comando 'kick' con su descripción y opciones
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa a un usuario del servidor.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a expulsar.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Razón para expulsar al usuario.')
                .setMinLength(3)
                .setMaxLength(100)
                .setRequired(true)),

    // Función asíncrona que se ejecuta cuando se utiliza el comando
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');

        // Verificar si el miembro que ejecuta el comando tiene permisos para expulsar
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(user.id); // Obtener el miembro del servidor
        if (member) {
            await interaction.deferReply(); 

            try {
                const caseNumber = getCaseNumber(); 
                const serverIconURL = interaction.guild.iconURL({ dynamic: true }); 

                // Crear el embed para el mensaje de expulsión
                const embed = new EmbedBuilder()
                    .setTitle('Usuario Sancionado')
                    .setDescription(`<@${member.id}> ha sido expulsado`)
                    .setColor(0xD93C40)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true })) // Añadir la foto de perfil del usuario
                    .addFields(
                        { name: 'Razón', value: reason, inline: true },
                        { name: 'Caso', value: `#${caseNumber}`, inline: true }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp();

                // Enviar un mensaje al usuario expulsado
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('¡Has sido Sancionado!')
                            .setDescription(`Has sido expulsado de ${interaction.guild.name}.`)
                            .setColor(0xD93C40)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true })) // Añadir la foto de perfil del usuario
                            .addFields(
                                { name: '❌ Razón', value: reason, inline: true },
                                { name: '📋 Caso', value: `#${caseNumber}`, inline: true }
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                            .setTimestamp()
                    ]
                }).catch(console.error);
                    
                    // Expulsar al usuario del servidor
                    await member.kick(reason).catch(console.error);

                // Editar la respuesta de la interacción con el embed de expulsión
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
