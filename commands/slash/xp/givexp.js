const { SlashCommandBuilder } = require('@discordjs/builders');
const UserProfile = require('../../../models/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givexp')
        .setDescription('Dar XP a un usuario.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario al que quieres dar XP')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('cantidad')
                .setDescription('Cantidad de XP a dar')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const guildId = interaction.guild.id;
            const targetUser = interaction.options.getUser('usuario');
            const userId = interaction.options.getUser('usuario').id;
            const xpAmount = interaction.options.getInteger('cantidad');

            // Obtener o crear el perfil del usuario
            const userProfile = await getUserProfile(guildId, userId, targetUser.username);
            console.log(targetUser.username);

            // Añadir XP al usuario
            const leveledUp = addXpToUser(userProfile, xpAmount, guildId);

            await userProfile.save();

            // Notificar al usuario si subió de nivel
            if (leveledUp) {
                await notifyLevelUp(interaction, userProfile);
            }

            // Responder al comando
            await interaction.reply({
                content: `Se han dado ${xpAmount} XP a ${interaction.options.getUser('usuario').username} y ahora es de nivel ${userProfile.levels.find(level => level.guildId === guildId).level}.`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error giving XP:', error);
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

// Función para añadir XP al usuario y verificar si sube de nivel
function addXpToUser(userProfile, xpAmount, guildId) {
    const guildProfile = userProfile.levels.find(level => level.guildId === guildId);
    
    if (!guildProfile) {
        throw new Error('Perfil del servidor no encontrado en el perfil del usuario.');
    }

    guildProfile.xp += xpAmount;
    const xpToNextLevel = guildProfile.level * 100; // Ejemplo de fórmula para subir de nivel

    if (guildProfile.xp >= xpToNextLevel) {
        guildProfile.level += 1;
        guildProfile.xp -= xpToNextLevel;
        return true; // El usuario subió de nivel
    }

    return false; // El usuario no subió de nivel
}

// Función para notificar al usuario y al canal que subió de nivel
async function notifyLevelUp(interaction, userProfile) {
    await interaction.channel.send(`${interaction.options.getUser('usuario').username} ha subido al nivel ${userProfile.level}!`);
}