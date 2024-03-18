const User = require("../models/UserModel");

const getOnlineUser = async (req, res) => {
  const user = await User.findOne({ username: req.body.chat });
  if (user) {
    res.status(200).json({
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      message: true,
    });
  } else {
    res.status(404).json({ message: "no user" });
  }
};

module.exports = getOnlineUser;
