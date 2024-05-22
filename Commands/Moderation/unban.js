// Importar los constructores necesarios para construir comandos de slash y crear objetos de Embed y Permisos
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    // Definir los datos del comando de slash
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Desbanear a un usuario del servidor.') 
        .addStringOption(option => 
            option.setName('userid') 
                .setDescription('El ID del usuario a desbanear.') 
                .setRequired(true)) 
        .addStringOption(option =>
            option.setName('reason') 
                .setDescription('Razón para desbanear al usuario.') 
                .setRequired(false)), 
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
                .setColor(0x01DD7B) 
                .setTitle('Usuario Desbaneado') 
                .addFields(
                    { name: 'ID', value: userId, inline: true }, 
                    { name: 'Staff', value: `<@${interaction.user.id}>`, inline: true }, 
                    { name: 'Razón', value: reason, inline: true } 
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
