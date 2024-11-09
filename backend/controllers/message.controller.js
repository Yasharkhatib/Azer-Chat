import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Controller to send a message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Find or create the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create the new message and link it to the conversation
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id, // Set the conversationId here
    });

    // Save the new message and update the conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Save both conversation and message
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit the new message to the receiver using socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find conversation between the sender and the receiver (userToChatId)
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // Populate messages with full message details (not just IDs)

    if (!conversation) return res.status(200).json([]); // Return an empty array if no conversation

    // Return the list of messages in the conversation
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
