const { SlashCommandBuilder } = require('@discordjs/builders');
const UserProfile = require('../../../models/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removexp')
        .setDescription('Quitar XP a un usuario.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario al que quieres quitar XP')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('cantidad')
                .setDescription('Cantidad de XP a quitar')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const guildId = interaction.guild.id;
            const targetUser = interaction.options.getUser('usuario');
            const userId = targetUser.id;
            const xpAmount = interaction.options.getInteger('cantidad');

            // Obtener el perfil del usuario
            const userProfile = await getUserProfile(guildId, userId, targetUser.username);

            // Quitar XP al usuario
            const updatedXp = removeXpFromUser(userProfile, xpAmount, guildId);

            await userProfile.save();

            // Responder al comando
            await interaction.reply({
                content: `Se han quitado ${xpAmount} XP a ${targetUser.username}. (XP restante: ${updatedXp})`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error removing XP:', error);
            await interaction.reply({ 
                content: 'Hubo un error al ejecutar este comando.', 
                ephemeral: true 
            });
        }
    },
};

// Función para obtener o crear el perfil del usuario
async function getUserProfile(guildId, userId, username) {
    let userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
        userProfile = new UserProfile({
            userId,
            username,
            levels: [{ guildId, xp: 0, level: 1, messages: 1 }]
        });
    } else {
        const guildProfile = userProfile.levels.find(level => level.guildId === guildId);
        if (!guildProfile) {
            userProfile.levels.push({ guildId, xp: 0, level: 1, messages: 1 });
        }
    }

    return userProfile;
}

// Función para quitar XP al usuario y asegurarse de que no sea negativo
function removeXpFromUser(userProfile, xpAmount, guildId) {
    const guildProfile = userProfile.levels.find(level => level.guildId === guildId);
    
    if (!guildProfile) {
        throw new Error('Perfil del servidor no encontrado en el perfil del usuario.');
    }

    guildProfile.xp = Math.max(guildProfile.xp - xpAmount, 0);

    // Ajustar el nivel si es necesario
    while (guildProfile.level > 1 && guildProfile.xp < (guildProfile.level - 1) * 100) {
        guildProfile.level -= 1;
    }

    return guildProfile.xp;
}
