const mongoose = require('mongoose');

const ticketConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    staffRoleId: { type: String, required: true },
    logChannelId: { type: String, required: true },
    ticketChannelId: { type: String, required: true },
    categoryNames: { type: [String], required: true },
});

module.exports = mongoose.model('TicketConfig', ticketConfigSchema);
