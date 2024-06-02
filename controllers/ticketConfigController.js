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
    }
};
