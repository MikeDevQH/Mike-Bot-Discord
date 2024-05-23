const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Desmutear a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a desmutear')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('usuario');

        // Verifica si el usuario tiene permisos para quitar el aislamiento temporal
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
        }

        if (!member.manageable) {
            return interaction.reply({ content: 'No puedo desmutear a este usuario.', ephemeral: true });
        }

        try {
            await member.timeout(null); 
            const serverIconURL = interaction.guild.iconURL()
            const embed = new EmbedBuilder()
                .setTitle('Sanción Removida')
                .setDescription(`<@${member.id}> ha sido desmuteado.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) 
                .setColor(0x01DD7B)
                .setFooter({ text: `${interaction.guild.name} `, iconURL: serverIconURL })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            const dmEmbed = new EmbedBuilder()
                .setTitle('Sanción Removida')
                .setDescription(`Has sido desmuteado de ${interaction.guild.name}.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) 
                .setColor(0x01DD7B)
                .setFooter({ text: `${interaction.guild.name} `, iconURL: serverIconURL })
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] }).catch(err => {
                console.log('No se pudo enviar el mensaje directo al usuario.');
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Hubo un error al intentar desaislar al usuario.', ephemeral: true });
        }
    },
};
