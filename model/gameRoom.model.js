const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  currentWord: String,
  guessedLetters: [String],
  incorrectGuesses: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameRoom", gameRoomSchema);
