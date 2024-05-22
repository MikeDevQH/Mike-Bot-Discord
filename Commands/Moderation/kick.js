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
            await interaction.deferReply(); // Aplazar la respuesta para dar más tiempo

            try {
                const caseNumber = getCaseNumber(); // Obtener el número de caso de expulsión

                // Crear el embed para el mensaje de expulsión
                const embed = new EmbedBuilder()
                    .setTitle('Usuario Expulsado')
                    .setColor(0xD93C40)
                    .addFields(
                        { name: 'Usuario', value: `<@${user.id}>`, inline: true },
                        { name: 'Staff', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Razón', value: reason, inline: true },
                        { name: 'Caso', value: `#${caseNumber}`, inline: true }
                    )
                    .setTimestamp();

                // Enviar un mensaje al usuario expulsado
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Has sido expulsado del servidor ${interaction.guild.name}.`)
                            .setColor(0xD93C40)
                            .addFields(
                                { name: 'Razón', value: reason, inline: true },
                                { name: 'Caso', value: `#${caseNumber}`, inline: true }
                            )
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