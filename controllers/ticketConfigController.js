const TicketConfig = require('../models/ticketConfig');

module.exports = {
    async setTicketConfig(config) {
        let ticketConfig = await TicketConfig.findOne({ guildId: config.guildId });
        if (!ticketConfig) {
            ticketConfig = new TicketConfig({ guildId: config.guildId });
        }

        ticketConfig.staffRoleId = config.staffRoleId;
        ticketConfig.logChannelId = config.logChannelId;
        ticketConfig.ticketChannelId = config.ticketChannelId;
        ticketConfig.categoryNames = config.categoryNames;

        await ticketConfig.save();
    },

    async getTicketConfig(guildId) {
        return await TicketConfig.findOne({ guildId });
    },

    async getTicketLogChannel(guildId) {
        const ticketConfig = await TicketConfig.findOne({ guildId });
        if (ticketConfig) {
            return ticketConfig.logChannelId;
        } else {
            return null; // O retorna lo que sea apropiado para indicar que el canal de logs no está configurado
        }
    }
};
