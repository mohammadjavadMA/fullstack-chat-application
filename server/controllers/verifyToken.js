const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const verifyToken = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const verification = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const user = await User.findById(verification.id);
      if (user) {
        res.status(200).json({ message: "chat", username: user.username });
      } else {
        res.status(200).json({ message: "stay" });
      }
    } else {
      res.status(200).send({ message: "no token" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = verifyToken;
