import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import User from "../models/auth.model.js";
import Message from "../models/message.model.js";

export const getUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // console.log(loggedInUserId);
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    return res
      .status(200)
      .json({ message: "user found successfully", filteredUsers });
  } catch (error) {
    console.log("error to get user", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const { _id } = req.user;
    // console.log(_id.toString());
    // console.log(userToChatId, "<====>", myId);
    const messages = await Message.find({
      $or: [
        { senderId: myId.toString(), receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId.toString() },
      ],
    });
    // console.log(messages);
    return res.status(200).json(messages);
  } catch (error) {
    console.log("error to get message", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // socket implementation

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error to send message");
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
