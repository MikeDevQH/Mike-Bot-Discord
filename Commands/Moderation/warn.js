const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta del archivo data.json para almacenar el número de casos de avisos
const dataPath = path.resolve(__dirname, '../../data.json');
let data = require(dataPath);

// Función para obtener y aumentar el número de casos de avisos
const getCaseNumber = () => {
    data.warnCaseCount += 1;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return data.warnCaseCount;
};

// Función para registrar un aviso para un usuario
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
    // Definir el comando 'warn' con su descripción y opciones
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

    // Función asíncrona que se ejecuta cuando se utiliza el comando
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');

        // Verificar si el miembro que ejecuta el comando tiene permisos para avisar
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'No tienes permiso para ejecutar este comando.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(user.id); // Obtener el miembro del servidor
        if (member) {
            await interaction.deferReply();  

            try {
                const caseNumber = getCaseNumber(); 
                const warningCount = addWarning(user.id); 
                const serverIconURL = interaction.guild.iconURL(); 

                // Crear el embed para el mensaje de aviso
                const embed = new EmbedBuilder()
                    .setTitle('Usuario Advertido')
                    .setColor(0xFFA500)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true })) 
                    .addFields(
                        { name: 'Usuario', value: `<@${user.id}>`, inline: true },
                        { name: 'Razón', value: reason, inline: true },
                        { name: 'Caso', value: `#${caseNumber}`, inline: true },
                        { name: 'Número de Advertencias', value: warningCount.toString(), inline: true }
                    )
                    .setFooter({ text: `${interaction.guild.name} `, iconURL: serverIconURL })
                    .setTimestamp();

                // Enviar un mensaje al usuario avisado
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('¡Has recibido una Adverencia!')
                            .setColor(0xFFA500)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true })) 
                            .addFields(
                                { name: '🚨 Razón', value: reason, inline: true },
                                { name: '📝 Caso', value: `#${caseNumber}`, inline: true },
                                { name: '⚠️ Número de Advertencias', value: warningCount.toString(), inline: true }
                            )
                            .setFooter({ text: `${interaction.guild.name} `, iconURL: serverIconURL })
                            .setTimestamp()
                    ]
                }).catch(console.error);

                // Editar la respuesta de la interacción con el embed de aviso
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
