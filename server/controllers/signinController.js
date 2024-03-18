const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const uuid = require("uuid").v4;

const signupController = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.status(200).json({ message: "signedin", token: token });
    } else {
      res.status(400).json({ message: "userbefore" });
    }
  } else {
    try {
      if (req.files) {
        const { name, data, mimetype, size } = req.files.photo;
        if (size > 5000000) {
          return res.status(400).json({ message: "size" });
        }
        const fileName = `${uuid()}_${name}`;
        await User.validate(req.body);
        sharp(data)
          .jpeg({ quality: 60 })
          .toFile(`./public/avatars/${fileName}`);
        const newPass = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
          ...req.body,
          password: newPass,
          photoLink: `http://localhost:3000/avatars/${fileName}`,
        });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 15 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ message: "suc", token });
      } else {
        res.status(400).json({ message: "profile" });
      }
    } catch (err) {
      next(err);
    }
  }
};

module.exports = signupController;
