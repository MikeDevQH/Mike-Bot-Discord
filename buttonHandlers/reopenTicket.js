const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    id: 'reopenTicket',
    async execute(interaction) {
        const { channel, member, guild } = interaction;

        await channel.edit({
            name: channel.name.replace('cerrado-', ''),
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: member.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                }
            ],
        });

        await interaction.reply({ content: 'El ticket ha sido reabierto.', ephemeral: true });
    }
};
