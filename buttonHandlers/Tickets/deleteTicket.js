const { EmbedBuilder } = require('discord.js');
const ticketConfigController = require('../../controllers/ticketConfigController');

module.exports = {
    // Comando para iniciar la eliminación del ticket
    id: 'deleteTicket',
    async execute(interaction) {
        try {
            const ticketChannelName = interaction.channel.name; // Capturar el nombre del canal del ticket

            const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('El ticket será eliminado en 5 segundos')
            
            // Enviar el embed indicando que el ticket se eliminara en 5 segundos
            await interaction.reply({ embeds: [embed] });

            // Esperar 5 segundos
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Eliminar el canal del ticket
            await interaction.channel.delete();

            // Enviar un mensaje incrustado al canal de logs
            const logChannelId = await ticketConfigController.getTicketLogChannel(interaction.guild.id); // Función para obtener el ID del canal de logs configurado
            const logChannel = interaction.guild.channels.cache.get(logChannelId);

            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Ticket Eliminado')
                    .setDescription(`El ticket **${ticketChannelName}** fue eliminado por ${interaction.member.user.tag}.`)
                
                await logChannel.send({ embeds: [embed] });
            } else {
                console.error('No se pudo encontrar el canal de logs.');
            }
        } catch (error) {
            console.error('Error en deleteTicket:', error);
            await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
        }
    }
};
