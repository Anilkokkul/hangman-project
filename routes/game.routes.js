const GameRoom = require("../model/gameRoom.model");
const express = require("express");

const router = express.Router();

router.post("/create-room", async (req, res) => {
  const { roomId } = req.body;
  const gameRoom = new GameRoom({ roomId });
  await gameRoom.save();
  res.status(201).send("Game room created");
});

router.post("/join-room", async (req, res) => {
  const { roomId, userId } = req.body;
  const gameRoom = await GameRoom.findOne({ roomId });
  if (!gameRoom) return res.status(404).send("Room not found");
  gameRoom.players.push(userId);
  await gameRoom.save();
  res.status(200).send("Joined room");
});

module.exports = router;
