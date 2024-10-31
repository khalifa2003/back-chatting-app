const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const path = require("path");
const logger = require("morgan");
const express = require("express");
const app = express();
// const dbConnection = require("./config/database");
// Socket.Io
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;
// Connect with db
// dbConnection();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// middleware
app.use(logger("dev"));

// Routes
app.get("/chat", (req, res) => {
  res.render("chat");
});

io.on("connection", function (socket) {
  // Every socket connection has a unique ID
  console.log("new connection: " + socket.id);

  // Message Received

  socket.on("message", (message) => {
    console.log(message);
    // Broadcast to everyone else (except the sender)
    socket.broadcast.emit("message", {
      from: socket.id,
      message: message,
    });
    // Send back the same message to the sender
    socket.emit("message", {
      from: socket.id,
      message: message,
    });
  });

  // Disconnected
  socket.on("disconnect", function () {
    console.log("disconnect: " + socket.id);
    io.emit('disconnect', socket.id)
  });
});
