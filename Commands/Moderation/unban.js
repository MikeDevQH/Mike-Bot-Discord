// Importar los constructores necesarios para construir comandos de slash y crear objetos de Embed y Permisos
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    // Definir los datos del comando de slash
    data: new SlashCommandBuilder()
        .setName('unban') // Nombre del comando
        .setDescription('Desbanear a un usuario del servidor.') // Descripción del comando
        .addStringOption(option => 
            option.setName('userid') // Nombre de la opción para el ID del usuario
                .setDescription('El ID del usuario a desbanear.') // Descripción de la opción
                .setRequired(true)) // La opción es requerida
        .addStringOption(option =>
            option.setName('reason') // Nombre de la opción para la razón del desban
                .setDescription('Razón para desbanear al usuario.') // Descripción de la opción
                .setRequired(false)), // La opción no es requerida
    // Función para ejecutar el comando
    async execute(interaction) {
        // Obtener el ID del usuario y la razón de la interacción
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No se proporcionó una razón';

        // Verificar si el miembro tiene permisos para desbanear usuarios
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'No tienes permiso para desbanear miembros.', ephemeral: true });
        }

        try {
            // Desbanear al usuario
            await interaction.guild.members.unban(userId, reason);
            // Crear un embed para notificar el desban
            const unbanEmbed = new EmbedBuilder()
                .setColor(0x01DD7B) // Color del embed
                .setTitle('Usuario Desbaneado') // Título del embed
                .addFields(
                    { name: 'ID del Usuario Desbaneado', value: userId, inline: true }, // Campo para el ID del usuario desbaneado
                    { name: 'Desbaneado Por', value: interaction.user.tag, inline: true }, // Campo para quién desbaneó al usuario
                    { name: 'Razón', value: reason, inline: true } // Campo para la razón del desban
                )
                .setTimestamp(); // Establecer la marca de tiempo del embed

            // Responder con el embed de desban
            await interaction.reply({ embeds: [unbanEmbed] });
        } catch (error) {
            console.error('Error al desbanear usuario:', error);
            // Manejar errores al desbanear y responder con un mensaje de error
            await interaction.reply({ content: `No se pudo desbanear al usuario con ID ${userId}. Por favor, asegúrate de que el ID sea correcto y el usuario esté baneado.`, ephemeral: true });
        }
    },
};
