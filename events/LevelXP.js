const { Events } = require('discord.js');
const UserProfile = require('../models/UserProfile');

class XpSystem {
    constructor() {
        this.cooldowns = new Map();
        this.COOLDOWN_TIME = 60000; // 1 minuto en milisegundos
        this.levelUpChannelId = 'CANAL_ID_AQUI'; // Reemplaza con la ID del canal donde quieres enviar los mensajes de subida de nivel
    }

    // Verifica si un usuario está en cooldown
    isOnCooldown(userId) {
        const lastXpTime = this.cooldowns.get(userId);
        return lastXpTime && (Date.now() - lastXpTime) < this.COOLDOWN_TIME;
    }

    // Establece el cooldown para un usuario
    setCooldown(userId) {
        this.cooldowns.set(userId, Date.now());
    }

    // Obtiene o crea el perfil del usuario dentro del array de levels
    static async fetchOrCreateUserProfile(guildId, userId, username) {
        let userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            userProfile = new UserProfile({
                userId,
                username,
                levels: [{
                    guildId,
                    xp: 0,
                    level: 1,
                    messages: 1
                }]
            });
        } else {
            const guildProfile = userProfile.levels.find(profile => profile.guildId === guildId);
            if (!guildProfile) {
                userProfile.levels.push({
                    guildId,
                    xp: 0,
                    level: 1,
                    messages: 1
                });
            }
        }
        return userProfile;
    }

    // Calcula la cantidad de XP que se gana
    static calculateXpGain() {
        const baseXpGain = Math.floor(Math.random() * 10) + 1;
        return baseXpGain;
    }

    // Verifica si el usuario sube de nivel
    static shouldLevelUp(guildProfile) {
        const xpToNextLevel = guildProfile.level * 100;
        return guildProfile.xp >= xpToNextLevel;
    }

    // Maneja el proceso de subir de nivel
    async handleLevelUp(guildProfile, message) {
        guildProfile.level += 1;
        guildProfile.xp -= guildProfile.level * 100;

        const levelUpMessage = `Felicidades ${message.author.username}, ¡acabas de avanzar al nivel ${guildProfile.level}!`;

        await this.sendLevelUpMessage(levelUpMessage, message.guild);
    }

    // Envía el mensaje de subida de nivel al canal especificado
    async sendLevelUpMessage(levelUpMessage, guild) {
        try {
            const channel = await guild.channels.fetch(this.levelUpChannelId);
            if (channel) {
                channel.send(levelUpMessage);
            } else {
                console.error('Canal no encontrado:', this.levelUpChannelId);
            }
        } catch (error) {
            console.error('Error al enviar el mensaje de nivelación:', error);
        }
    }
}

const xpSystem = new XpSystem();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; // Ignora mensajes de otros bots

        const { id: userId, username } = message.author;

        // Verifica si el usuario está en cooldown
        if (xpSystem.isOnCooldown(userId)) return;

        try {
            const { id: guildId } = message.guild;

            // Obtiene o crea el perfil del usuario
            const userProfile = await XpSystem.fetchOrCreateUserProfile(guildId, userId, username);
            const guildProfile = userProfile.levels.find(profile => profile.guildId === guildId);

            // Incrementa el XP y verifica si sube de nivel
            const xpGained = XpSystem.calculateXpGain();
            guildProfile.xp += xpGained;
            guildProfile.messages += 1;

            if (XpSystem.shouldLevelUp(guildProfile)) {
                await xpSystem.handleLevelUp(guildProfile, message);
            }

            await userProfile.save();
            xpSystem.setCooldown(userId);
        } catch (error) {
            console.error('Error al manejar el mensaje:', error);
        }
    },
};
