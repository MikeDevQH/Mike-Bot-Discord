const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Elimina un número específico de mensajes recientes en este canal')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('El número de mensajes a eliminar (entre 1 y 100)')
                .setRequired(true)),
    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');

        // Verifica si el usuario tiene el permiso de 'MANAGE_MESSAGES'
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
        }

        // Verifica si el bot tiene el permiso de 'MANAGE_MESSAGES'
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'No tengo permiso para gestionar mensajes.', ephemeral: true });
        }

        // Verifica si la cantidad es un número válido entre 1 y 100
        if (cantidad < 1 || cantidad > 100) {
            return interaction.reply({ content: 'Por favor, proporciona un número entre 1 y 100.', ephemeral: true });
        }

        // Elimina en masa los mensajes
        try {
            const deletedMessages = await interaction.channel.bulkDelete(cantidad, true);

            // Crear el embed de confirmación
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`> Se han eliminado los últimos ${deletedMessages.size} mensajes.`)
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al eliminar los mensajes:', error);
            return interaction.reply({ content: 'Hubo un error al intentar eliminar los mensajes en este canal.', ephemeral: true });
        }
    },
};
