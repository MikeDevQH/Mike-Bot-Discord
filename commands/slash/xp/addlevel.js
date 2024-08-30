const { SlashCommandBuilder } = require('@discordjs/builders');
const UserProfile = require('../../../models/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addlevel')
        .setDescription('Añadir un nivel a un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que quieres añadir un nivel')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de niveles a añadir')
                .setRequired(true)),
    
    async execute(interaction) {
        const userId = interaction.options.getUser('usuario').id;
        const guildId = interaction.guild.id;
        const levelAmount = interaction.options.getInteger('cantidad');

        try {
            // Obtener y actualizar el perfil del usuario en el servidor específico
            const updatedLevel = await addUserLevel(userId, guildId, levelAmount);
            if (updatedLevel === null) {
                return interaction.reply({ content: 'El usuario no tiene un perfil registrado en este servidor.', ephemeral: true });
            }

            await interaction.reply({ content: `Se han añadido ${levelAmount} niveles a ${interaction.options.getUser('usuario').username}. Ahora está en nivel ${updatedLevel}.`, ephemeral: true });
        } catch (error) {
            console.error('Error adding level:', error);
            await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
        }
    },
};

// Función para obtener y aumentar el nivel del usuario en un servidor específico
async function addUserLevel(userId, guildId, levelAmount) {
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
        return null; // Usuario no tiene perfil registrado
    }

    const guildProfile = userProfile.levels.find(level => level.guildId === guildId);

    if (!guildProfile) {
        return null; // Usuario no tiene perfil en este servidor
    }

    // Aumentar el nivel del usuario
    guildProfile.level += levelAmount;

    await userProfile.save();

    return guildProfile.level;
}
