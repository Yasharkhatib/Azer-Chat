import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Controller to send a message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // Extract the receiver's ID from the params
    const senderId = req.user._id; // Authenticated user's ID

    // Find or create the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create and save the new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id, // Set the conversationId
    });

    // Add the message to the conversation's messages
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Emit the new message to the receiver's socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage); // Send the message back to the sender
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find the conversation between the sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate({
      path: "messages",
      model: "Message",
      populate: { path: "senderId receiverId", select: "name" }, // Populate sender and receiver details if needed
    });

    if (!conversation) return res.status(200).json([]); // No conversation yet, send an empty array

    res.status(200).json(conversation.messages); // Send conversation messages
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
