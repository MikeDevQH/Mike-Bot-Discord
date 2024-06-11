const { EmbedBuilder } = require('discord.js');
const ticketConfigController = require('../../controllers/ticketConfigController');

module.exports = {
    id: 'submitDeleteTicketReason',
    async execute(interaction) {
        const { member, channel, guild } = interaction;

        try {

            // Obtener el mensaje del embed
            const messages = await channel.messages.fetch({ limit: 100 });
            const ticketMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith('UserID:'));

            if (!ticketMessage) {
                await interaction.reply({ content: 'No se pudo encontrar el mensaje original del ticket.', ephemeral: true });
                return;
            }

            const originalMemberId = ticketMessage.embeds[0].footer.text.replace('UserID: ', ''); //  Extraer el ID del usuario del footer del embed          
            const originalMember = await guild.members.fetch(originalMemberId); // Obtener el miembro correspondiente al ID de usuario          
            const originalUser = originalMember.user;  // Obtener el usuario a partir del miembro
            const ticketChannelName = interaction.channel.name; // Capturar el nombre del canal del ticket
            const reason = interaction.fields.getTextInputValue('reasonInput'); // Obtener el motivo del modal

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
                    .addFields({ name: 'Motivo', value: reason });

                await logChannel.send({ embeds: [embed] });
            } else {
                console.error('No se pudo encontrar el canal de logs.');
            }

            // Crear el embed con la información del ticket
            if (originalMember) {
                const userEmbed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle('🎫 Ticket Cerrado')
                    .setDescription('📩 Tu ticket ha sido cerrado por un miembro del staff. Si crees que esto fue un error o necesitas más ayuda, puedes abrir un nuevo ticket.')
                    .addFields(
                        { name: '👤 Cerrado por', value: interaction.member.user.tag },
                        { name: '📝 Motivo', value: reason || 'No especificado' }
                    )
                    .setThumbnail(interaction.guild.iconURL())
                    .setFooter({ text: 'Gracias por usar nuestro sistema de tickets. ¡Estamos aquí para ayudarte! 😊' })
                    .setTimestamp();


                // Enviar el mensaje al usuario
                await originalUser.send({ embeds: [userEmbed] });
            } else {
                console.error('No se pudo enviar el mensaje directo al usuario')
            }



        } catch (error) {
            console.error('Error en submitDeleteTicketReason:', error);
            await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
        }
    }
};
