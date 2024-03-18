const mongoose = require("mongoose");

const UserYupSchema = require("./UserYupSchema");

const chatSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  chats: [
    {
      message: { type: String, required: true },
      from: { type: String, required: true },
      messageType: { type: String },
      dateSent: { type: Date, required: true },
      isRead: { type: Boolean },
    },
  ],
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
  },
  photoLink: {
    type: String,
    required: true,
  },
  chats: {
    type: [chatSchema],
    default: [],
  },
  searchHistory: {
    type: [],
    default: [],
  },
  lastSeen: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isOnline: { type: Boolean, required: false, default: false },
  socketId: { type: String, required: false },
});

userSchema.statics.validate = function (body) {
  return UserYupSchema.validate(body, { abortEarly: false });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
