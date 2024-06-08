const StaffStats = require('../models/staffStats');

module.exports = {
    async incrementClaimedTickets(guildId, staffId) {
        await StaffStats.findOneAndUpdate(
            { guildId, staffId },
            { $inc: { claimedTickets: 1 } },
            { upsert: true, new: true }
        );
    },

    async getTopStaff(guildId) {
        return await StaffStats.find({ guildId }).sort({ claimedTickets: -1 }).limit(10).exec();
    },
};
