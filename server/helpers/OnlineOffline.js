const User = require("../models/UserModel");

exports.makeUserOnline = async (username, socketId, socket) => {
  const user = await User.findOne({ username });
  user.isOnline = true;
  user.socketId = socketId;
  user.chats.forEach(async (c) => {
    const newUser = await User.findOne({ username: c.user });
    if (newUser.socketId != "") {
      socket.to(newUser.socketId).emit("online", username);
    }
  });
  await user.save();
};
exports.makeUserOffline = async (socketId, username, socket) => {
  const user = await User.findOne({ socketId });
  if (user) {
    user.isOnline = false;
    user.socketId = "";
    await user.save();
    user.chats.forEach(async (c) => {
      const newUser = await User.findOne({ username: c.user });
      if (newUser.socketId != "") {
        socket.to(newUser.socketId).emit("offline", username);
      }
    });
  }
};
exports.socketGetter = (socket) => {
  return (req, _, next) => {
    req.socket = socket;
    next();
  };
};
