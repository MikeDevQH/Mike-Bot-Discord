const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ticketConfigController = require('../../controllers/ticketConfigController');
const staffStatsController = require('../../controllers/staffStatsController');

module.exports = {
    id: 'claimTicket',
    async execute(interaction) {
        const { member, channel, guild } = interaction;
        const server = interaction.guild;
        const serverIconURL = interaction.guild.iconURL({ dynamic: true }); 

        // Obtener la configuración de tickets desde la base de datos
        const config = await ticketConfigController.getTicketConfig(guild.id);
        if (!config) {
            await interaction.reply({ content: 'No se pudo encontrar la configuración del sistema de tickets.', ephemeral: true });
            return;
        }

        // Verificar si el usuario tiene el rol de staff
        if (!member.roles.cache.has(config.staffRoleId)) {
            await interaction.reply({ content: 'No tienes permiso para reclamar este ticket.', ephemeral: true });
            return;
        }

        // Verificar si el ticket ya ha sido reclamado
        if (channel.permissionOverwrites.cache.has(member.id)) {
            await interaction.reply({ content: 'Ya has reclamado este ticket.', ephemeral: true });
            return;
        }

        // Conceder permisos de acceso al usuario que reclama el ticket
        await channel.permissionOverwrites.edit(member.id, {
            ViewChannel: true,
            SendMessages: true,
        });

        // Incrementar el contador de tickets reclamados para el miembro del staff
        try {
            await staffStatsController.incrementClaimedTickets(guild.id, member.id);
        } catch (error) {
            console.error('Error incrementing claimed tickets:', error);
        }

        
        const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setDescription('**¡Has reclamado un ticket, buena suerte!**\n*Se amable y paciente al tratar con los usuarios, te lo agradecerán*')
       

        const claimEmbed = new EmbedBuilder()
                .setTitle(`🎟️ Ticket reclamado por ${member.user.tag}.`)
                .setColor(0x3498db)
                .setDescription('Un staff ha reclamado tu ticket y será el encargado de atenderte y ayudarte en lo que necesites\n\n``Recuerda especificar lo que necesitas y hablar claro para poder atenderte lo mejor y más rápido posible``')
                .setFooter({ text: `Equipo Administrativo de ${server.name}`, iconURL: serverIconURL })

        await interaction.reply({ embeds: [embed], ephemeral: true })                
        await interaction.followUp({ embeds: [claimEmbed] });
            
             
    }
};
