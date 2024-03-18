const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

exports.typing = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const sender = await User.findById(payload.id);
      if (sender) {
        const user = await User.findOne({ username: req.body.to });
        if (user) {
          if (user.socketId) {
            req.socket.to(user.socketId).emit("typing", sender.username);
            res.status(200).json({ message: "emitted" });
          } else {
            res.status(400).json({ message: "not online" });
          }
        } else {
          res.status(404).json({ message: "no user" });
        }
      } else {
        res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(400).json({ message: "no token" });
    }
  } catch (err) {
    next(err);
  }
};
exports.endedTyping = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const sender = await User.findById(payload.id);
      if (sender) {
        const user = await User.findOne({ username: req.body.to });
        if (user) {
          if (user.socketId) {
            req.socket.to(user.socketId).emit("ended-typing", sender.username);
            res.status(200).json({ message: "emitted" });
          } else {
            res.status(400).json({ message: "not online" });
          }
        } else {
          res.status(404).json({ message: "no user" });
        }
      } else {
        res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(400).json({ message: "no token" });
    }
  } catch (err) {
    next(err);
  }
};
exports.sendMessage = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const user = await User.findOne({ username: req.body.to });
      const sender = await User.findById(payload.id);
      if (!user) {
        return res.status(404).json({ message: "no user" });
      }
      if (sender.username == user.username) {
        return res.status(400).json({ message: "yourself" });
      }
      if (sender) {
        const d = new Date();
        if (user.socketId) {
          req.socket.to(user.socketId).emit("message", {
            message: req.body.message,
            from: sender.username,
          });
        }
        const senderChatIndex = sender.chats.findIndex((c) => {
          return c.user === user.username;
        });
        if (senderChatIndex != -1) {
          sender.chats[senderChatIndex].chats.unshift({
            from: "you",
            message: req.body.message,
            dateSent: d,
            isRead: false,
          });
          sender.markModified("chats");
          await sender.save();
        } else {
          sender.chats.push({
            user: user.username,
            chats: [
              {
                from: "you",
                message: req.body.message,
                dateSent: d,
                isRead: false,
              },
            ],
          });
          await sender.save();
        }
        const chatIndex = user.chats.findIndex((c) => {
          return c.user === sender.username;
        });
        if (chatIndex != -1) {
          user.chats[chatIndex].chats.unshift({
            from: sender.username,
            message: req.body.message,
            dateSent: d,
            isRead: false,
          });
          user.markModified("chats");
          await user.save();
        } else {
          user.chats.push({
            user: sender.username,
            chats: [
              {
                from: sender.username,
                message: req.body.message,
                dateSent: d,
                isRead: false,
              },
            ],
          });
          await user.save();
        }
        res.status(200).json({ message: "sent" });
      } else {
        res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(400).json({ message: "no token" });
    }
  } catch (err) {
    next(err);
  }
};
exports.sendingPhoto = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const user = await User.findOne({ username: req.body.to });
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const sender = await User.findById(payload.id);
      if (!user) {
        return res.status(404).json({ message: "no user" });
      }
      if (sender.username == user.username) {
        return res.status(400).json({ message: "yourself" });
      }
      if (sender) {
        req.socket.to(user.socketId).emit("sending-photo", sender.username);
        return res.status(200).json({ message: "sent" });
      } else {
        return res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(403).json({ message: "sign out" });
    }
  } catch (err) {
    next(err);
  }
};
exports.sendPhoto = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.to });
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const sender = await User.findById(payload.id);
      if (!user) {
        return res.status(404).json({ message: "کاربر مورد نظر یافت نشد" });
      }
      if (sender.username == user.username) {
        return res
          .status(400)
          .json({ message: "نمی توانید به خودتان پیام دهید" });
      }
      if (sender) {
        // var regex = /^data:.+\/(.+);base64,(.*)$/;
        // var matches = req.body.newUrl.match(regex);
        // const ext = matches[1];
        // const data = matches[2];
        // const buff = Buffer.from(data, "base64");
        // const fileName = uuid() + "." + ext;
        // fs.writeFileSync(
        //   path.join(__dirname, "private", "images", fileName),
        //   buff
        // );
        // sharp(buff)
        //   .jpeg({ quality: 5 })
        //   .toFile(
        //     path.join(
        //       __dirname,
        //       "private",
        //       "images",
        //       fileName.split(".")[0] + "_2" + "." + fileName.split(".")[1]
        //     )
        //   );
        const d = new Date();
        const fileName = `${uuid()}.${req.files.newUrl.mimetype.split("/")[1]}`;
        fs.writeFileSync(
          path.join(__dirname, "../", "private", "images", fileName),
          req.files.newUrl.data
        );
        // sharp(req.files.newUrl.data)
        //   .jpeg({ quality: 1 })
        //   .toFile(
        //     path.join(
        //       __dirname,
        //       "../",
        //       "private",
        //       "images",
        //       fileName.split(".")[0] + "_2." + fileName.split(".")[1]
        //     )
        //   );
        if (user.socketId) {
          req.socket.to(user.socketId).emit("image", {
            from: sender.username,
            message: fileName,
          });
        }
        const senderChatIndex = sender.chats.findIndex((c) => {
          return c.user === user.username;
        });
        if (senderChatIndex != -1) {
          sender.chats[senderChatIndex].chats.unshift({
            from: "you",
            message: fileName,
            dateSent: d,
            isRead: false,
            messageType: "photo",
          });
          sender.markModified("chats");
          await sender.save();
        } else {
          sender.chats.push({
            user: user.username,
            chats: [
              {
                from: "you",
                message: fileName,
                dateSent: d,
                isRead: false,
                messageType: "photo",
              },
            ],
          });
          await sender.save();
        }
        const chatIndex = user.chats.findIndex((c) => {
          return c.user === sender.username;
        });
        if (chatIndex != -1) {
          user.chats[chatIndex].chats.unshift({
            from: sender.username,
            message: fileName,
            dateSent: d,
            isRead: false,
            messageType: "photo",
          });
          user.markModified("chats");
          await user.save();
        } else {
          user.chats.push({
            user: sender.username,
            chats: [
              {
                from: sender.username,
                message: fileName,
                dateSent: d,
                isRead: false,
                messageType: "photo",
              },
            ],
          });
          await user.save();
        }
        res.status(200).json({ message: "sent" });
      } else {
        res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(400).json({ message: "no token" });
    }
  } catch (err) {
    next(err);
  }
};
exports.getImage = async (req, res, next) => {
  try {
    const { id } = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    const chatWithUser = user.chats.find((c) => {
      return c.user == req.body.username;
    });
    const orgMessage = chatWithUser.chats.find((c) => {
      return c.messageType == "photo" && c.message == req.body.imageName;
    });
    if (orgMessage) {
      if (!req.body.isReal) {
        const data = fs.readFileSync(
          path.join(__dirname, "../", "private", "images", req.body.imageName)
        );
        const data2 = await sharp(data).jpeg({ quality: 1 }).toBuffer();
        var uri =
          "data:" +
          "image/" +
          req.body.imageName.split(".")[1] +
          ";" +
          "base64" +
          "," +
          data2.toString("base64");
        res.status(200).json({ image: uri });
      } else if (req.body.isReal) {
        const data = fs.readFileSync(
          path.join(__dirname, "../", "private", "images", req.body.imageName)
        );
        var uri =
          "data:" +
          "image/" +
          req.body.imageName.split(".")[1] +
          ";" +
          "base64" +
          "," +
          data.toString("base64");
        res.status(200).json({ image: uri });
      }
    } else {
      res.status(403).json({ message: "no access" });
    }
  } catch (err) {
    next(err);
  }
};
exports.sendingFile = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const user = await User.findOne({ username: req.body.to });
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const sender = await User.findById(payload.id);
      if (!user) {
        return res.status(404).json({ message: "no user" });
      }
      if (sender.username == user.username) {
        return res.status(400).json({ message: "yourself" });
      }
      if (sender) {
        req.socket.to(user.socketId).emit("sending-file", sender.username);
        return res.status(200).json({ message: "sent" });
      } else {
        return res.status(403).json({ message: "sign out" });
      }
    } else {
      res.status(400).json({ message: "sign out" });
    }
  } catch (err) {
    next(err);
  }
};
exports.sendFile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const sender = await User.findById(payload.id);
      if (!user) {
        return res.status(404).json({ message: "no user" });
      }
      if (!sender) {
        return res.status(403).json({ message: "sign out" });
      }
      if (sender.username == user.username) {
        return res.status(400).json({ message: "yourself" });
      }
      const fileName = `${Math.floor(Math.random() * 1000000000000000)}_${
        req.body.fileName
      }`;
      if (user.socketId) {
        req.socket.to(user.socketId).emit("file", {
          from: sender.username,
          fileName,
        });
      }
      const d = new Date();
      const senderChatIndex = sender.chats.findIndex((c) => {
        return c.user === user.username;
      });
      if (senderChatIndex != -1) {
        sender.chats[senderChatIndex].chats.unshift({
          from: "you",
          message: fileName,
          messageType: "file",
          dateSent: d,
          isRead: false,
        });
        sender.markModified("chats");
        await sender.save();
      } else {
        sender.chats.push({
          user: user.username,
          chats: [
            {
              from: "you",
              message: fileName,
              messageType: "file",
              dateSent: d,
              isRead: false,
            },
          ],
        });
        await sender.save();
      }
      const chatIndex = user.chats.findIndex((c) => {
        return c.user === sender.username;
      });
      if (chatIndex != -1) {
        user.chats[chatIndex].chats.unshift({
          from: sender.username,
          message: fileName,
          messageType: "file",
          dateSent: d,
          isRead: false,
        });
        user.markModified("chats");
        await user.save();
      } else {
        user.chats.push({
          user: sender.username,
          chats: [
            {
              from: sender.username,
              message: fileName,
              messageType: "file",
              dateSent: d,
              isRead: false,
            },
          ],
        });
        await user.save();
      }
      fs.writeFile(
        path.join(__dirname, "../", "private", fileName),
        req.files.file.data,
        (err) => {
          if (err) return console.log(err);
        }
      );
      res.status(200).json({ message: "sent" });
    } else {
      res.status(400).json({ message: "no token" });
    }
  } catch (err) {
    next(err);
  }
};
exports.seenMessages = async (req, res, next) => {
  try {
    if (req.body.token != undefined && req.body.token != null) {
      const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(403).json({ message: "sign out" });
      }
      const userChatIndex = user.chats.findIndex((chat) => {
        return chat.user == req.body.username;
      });
      if (userChatIndex != -1) {
        user.chats[userChatIndex].chats.forEach((m) => {
          if (m.from != "you") {
            m.isRead = true;
          }
        });
        user.markModified("chats");
        await user.save();
      }
      if (req.body.username) {
        const secondUser = await User.findOne({ username: req.body.username });
        if (!secondUser) {
          return res.status(404).json({ message: "no user" });
        }
        const secondUserChatIndex = secondUser.chats.findIndex((chat) => {
          return chat.user == user.username;
        });
        if (secondUserChatIndex != -1) {
          secondUser.chats[secondUserChatIndex].chats.forEach((m) => {
            if (m.from == "you") {
              m.isRead = true;
            }
          });
          req.socket.to(secondUser.socketId).emit("sawmess", user.username);
        } else {
          res.status(400).json({ message: "chats did not seen" });
        }
        secondUser.markModified("chats");
        await secondUser.save();
        res.status(200).json({ message: "chats seen" });
      }
    } else {
      res.status(400).json({ message: "sign out" });
    }
  } catch (err) {
    next(err);
  }
};
