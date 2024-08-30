const { SlashCommandBuilder } = require('@discordjs/builders');
const { createXpCard } = require('../../../assets/createXPCard');
const UserProfile = require('../../../models/UserProfile');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Muestra la tarjeta de rango de un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario del que quieres ver la tarjeta de rango')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const targetUser = interaction.options.getUser('usuario') || interaction.user;
            const userId = targetUser.id;
            const guildId = interaction.guild.id;

            // Obtener el perfil del usuario
            const userProfile = await getUserProfile(userId, guildId);
            if (!userProfile) {
                return interaction.editReply(`No se encontró un perfil para ${targetUser.username} en este servidor.`);
            }

            // Calcular la información de XP y rango
            const { xp, level, nextLevelXP, rank } = await calculateXpAndRank(userProfile, guildId);

            // Obtener la URL del avatar del usuario y su estado
            const avatarURL = targetUser.displayAvatarURL({ format: 'png' });
            
            console.log(avatarURL)

            const userStatus = await getUserStatus(interaction, targetUser.id);

            // Crear la imagen de rango
            const rankImageBuffer = await createXpCard(
                targetUser.displayName, 
                xp, 
                level, 
                nextLevelXP, 
                rank, 
                avatarURL, 
                userStatus || 'offline'
            );
            const attachment = new AttachmentBuilder(rankImageBuffer, { name: 'rank.png' });

            // Enviar la respuesta con la imagen de rango
            await interaction.editReply({ files: [attachment] });

        } catch (error) {
            console.error('Error al generar la tarjeta de rango:', error);
            await interaction.editReply('Hubo un error al generar la tarjeta de rango.');
        }
    },
};

// Función para obtener el perfil del usuario
async function getUserProfile(userId, guildId) {
    const userProfile = await UserProfile.findOne({ userId });

    if (userProfile) {
        const guildProfile = userProfile.levels.find(level => level.guildId === guildId);
        if (guildProfile) {
            return guildProfile;
        }
    }

    // Si no se encuentra el perfil del usuario o el perfil de la guild, devolver null
    return null;
}

// Función para calcular la XP, el nivel y el rango del usuario
async function calculateXpAndRank(guildProfile, guildId) {
    const xp = guildProfile.xp;
    const level = guildProfile.level;
    const nextLevelXP = level * 100; // Ejemplo de fórmula para calcular la XP del siguiente nivel

    // Calcular el rango del usuario
    const rank = await UserProfile.countDocuments({
        'levels.guildId': guildId,
        'levels.xp': { $gt: xp }
    }) + 1;

    return { xp, level, nextLevelXP, rank };
}

// Función para obtener el estado del usuario
async function getUserStatus(interaction, targetUserId) {
    const member = await interaction.guild.members.fetch(targetUserId);
    return member.presence ? member.presence.status : 'offline';
}
