const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/auth-routes");
const gameRoutes = require("./routes/game.routes");
const cors = require("cors");
const { db } = require("./db/db.connect");
const { Server } = require("socket.io");
const http = require("http");
db();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(gameRoutes);
const port = process.env.PORT || 8000;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });
});

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
