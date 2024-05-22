const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getCaseNumber } = require('../../Handlers/handler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Aislar temporalmente a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a aislar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('El motivo del aislamiento')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tiempo')
                .setDescription('El tiempo de aislamiento (ej. 10s, 5m, 1h, 1d)')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('motivo');
        const timeInput = interaction.options.getString('tiempo');

        // Verifica si el usuario tiene permisos para aislar temporalmente
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
        }

        if (!member.manageable) {
            return interaction.reply({ content: 'No puedo aislar a este usuario.', ephemeral: true });
        }

        // Convertir tiempo
        const time = parseTime(timeInput);
        if (time === null) {
            return interaction.reply({ content: 'Formato de tiempo inválido. Usa s, m, h o d.', ephemeral: true });
        }

        try {
            const caseNumber = getCaseNumber('mute');
            await member.timeout(time, reason);
            const embed = new EmbedBuilder()
                .setTitle('Usuario Aislado')
                .setDescription(`<@${member.id}> ha sido muteado.`)
                .addFields(
                    { name: 'Razón', value: reason },
                    { name: 'Tiempo', value: timeInput },
                    { name: 'Staff', value: `<@${interaction.user.id}>` },
                    { name: 'Caso', value: `#${caseNumber}` }
                )
                .setColor(0xD93C40);

            await interaction.reply({ embeds: [embed] });

            const dmEmbed = new EmbedBuilder()
                .setTitle('Has sido muteado')
                .setDescription(`Has sido muteado del servidor ${interaction.guild.name}.`)
                .addFields(
                    { name: 'Razón', value: reason },
                    { name: 'Tiempo', value: timeInput }
                )
                .setColor(0xD93C40);

            await member.send({ embeds: [dmEmbed] }).catch(err => {
                console.log('No se pudo enviar el mensaje directo al usuario.');
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Hubo un error al intentar aislar al usuario.', ephemeral: true });
        }
    },
};

function parseTime(input) {
    const match = input.match(/^(\d+)([smhd])$/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's':
            return value * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        default:
            return null;
    }
}
