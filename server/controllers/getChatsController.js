const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const getChats = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      if (payload) {
        const user = await User.findById(payload.id);
        // await User.aggregate([{$}])
        if (user) {
          const chatWithUser = user.chats.find((chat) => {
            return chat.user == req.body.username;
          });
          if (chatWithUser) {
            res.status(200).json({ chat: chatWithUser, message: "got chat" });
          } else {
            res.status(404).json({ message: "no chat" });
          }
        } else {
          res.status(403).json({ message: "sign out" });
        }
      } else {
        res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(400).json({ message: "sign out" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getChats;
