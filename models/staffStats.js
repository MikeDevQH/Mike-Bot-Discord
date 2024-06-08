const mongoose = require('mongoose');

const staffStatsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    staffId: { type: String, required: true },
    claimedTickets: { type: Number, default: 0 },
});

module.exports = mongoose.model('StaffStats', staffStatsSchema);
