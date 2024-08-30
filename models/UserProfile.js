const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const levels = new Schema({
  guildId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  messages: { type: Number, default: 1 },
});

const UserProfileSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  levels: [levels]  // Array de perfiles por servidor
});

// Crear un índice único en userId y guildId dentro de levels
UserProfileSchema.index({ userId: 1, 'levels.guildId': 1 }, { unique: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
