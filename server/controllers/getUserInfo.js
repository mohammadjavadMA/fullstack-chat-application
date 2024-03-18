const User = require("../models/UserModel");

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(200).json({
        user: {
          contactName: user.username,
          contactProfileLink: user.photoLink,
          lastSeen: user.lastSeen,
        },
        message: "user got",
      });
    } else {
      res.status(404).json({ message: "no user" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getUserInfo;
