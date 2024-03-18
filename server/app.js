const express = require("express");
const dotEnv = require("dotenv").config();
uuid = require("uuid").v4;
const mongodb = require("./config/database");
const cors = require("cors");
const exfu = require("express-fileupload");
const { createServer } = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const {
  makeUserOffline,
  makeUserOnline,
  socketGetter,
} = require("./helpers/OnlineOffline");
const {
  typing,
  endedTyping,
  sendMessage,
  sendingPhoto,
  sendPhoto,
  getImage,
  sendingFile,
  sendFile,
  seenMessages,
} = require("./controllers/sendMessagesController");

const loginRouter = require("./routes/login");
const searchRouter = require("./routes/searchUser");
const getUserInfoRouter = require("./routes/getUserInfo");
const errorHandler = require("./utils/errorHandler");
const User = require("./models/UserModel");
const path = require("path");

mongodb();

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(exfu());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({message: "slash"});
})

const port = process.env.PORT || 3000;
io.on("connection", (socket) => {
  socket.on("online", (data) => {
    makeUserOnline(data, socket.id, socket);
  });
  app.post("/typing", socketGetter(socket), typing);
  app.post("/ended-typing", socketGetter(socket), endedTyping);
  app.post("/send-message", socketGetter(socket), sendMessage);
  app.post("/sending-photo", socketGetter(socket), sendingPhoto);
  app.post("/send-photo", socketGetter(socket), sendPhoto);
  app.post("/sending-file", socketGetter(socket), sendingFile);
  app.post("/send-file", socketGetter(socket), sendFile);
  app.post("/seen-messages", socketGetter(socket), seenMessages);
  socket.on("call", async ({ username, token }) => {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const caller = await User.findById(id);
    const called = await User.findOne({ username });
    if (caller) {
      if (called.isOnline) {
        socket.to(called.socketId).emit("calling you", caller.username);
      }
    }
  });
  socket.on("ans call", async ({ username, id }) => {
    const caller = await User.findOne({ username });
    socket.to(caller.socketId).emit("call answered", id);
  });
  socket.on("rej call", async (caller) => {
    const reqer = await User.findOne({ username: caller });
    socket.to(reqer.socketId).emit("call rejected");
  });
  socket.on("seen message", async ({ user, token }) => {
    const tk = jwt.verify(token, process.env.JWT_SECRET);
    const sender = await User.findById(tk.id);
    const us = await User.findOne({ username: user });
    if (us) {
      if (us.socketId) {
        io.to(us.socketId).emit("saw messages", sender.username);
      }
    }
    setTimeout(async () => {
      const sender2 = await User.findById(tk.id);
      sender2.chats[0].chats[0].isRead = true;
      sender2.markModified("chats");
      sender2.save();
    }, 500);
  });
  socket.on("disconnect", async () => {
    const offlineUser = await User.findOne({ socketId: socket.id });
    if (offlineUser) {
      const date = new Date();
      offlineUser.lastSeen = date;
      await offlineUser.save();
      makeUserOffline(socket.id, offlineUser.username, socket);
    }
  });
  app.use(errorHandler);
});
app.post("/get-file", (req, res) => {
  res.sendFile(
    path.join(__dirname, "private", req.body.fileName),
    req.body.fileName.split("_")[1]
  );
});
app.post("/get-image", getImage);
app.use(getUserInfoRouter);
app.use(loginRouter);
app.use(searchRouter);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
