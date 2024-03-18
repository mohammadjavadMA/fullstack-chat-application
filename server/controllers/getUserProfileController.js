const User = require("../models/UserModel");

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res
        .status(200)
        .json({ photoLink: user.photoLink, message: "found photo" });
    } else {
      res.status(404).json({ message: "no user" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getUserProfile;
