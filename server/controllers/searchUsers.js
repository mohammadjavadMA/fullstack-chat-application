const User = require("../models/UserModel");

const searchUser = async (req, res, next) => {
  try {
    if (req.body.search) {
      const user = await User.findOne({ username: req.body.search });
      if (user) {
        res.status(200).json({ user: user });
      } else {
        res.status(200).json({ message: "no user" });
      }
    } else {
      res.status(200).json({ message: "no search query" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = searchUser;
