const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const getContacts = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      if (user) {
        res
          .status(200)
          .json({ chats: user.chats, message: "got chats" });
      } else {
        res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(403).json({ message: "sign out" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getContacts;
