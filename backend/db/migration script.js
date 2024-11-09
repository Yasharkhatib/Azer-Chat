import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import dotenv from "dotenv";

dotenv.config();

const uri =
  "mongodb+srv://yasharkhiyali:Nmd147852369@cluster0.qlmwn.mongodb.net/chat-app-db?retryWrites=true&w=majority&appName=Cluster0";

if (!uri) {
  console.error("MongoDB URI is missing. Set MONGODB_URI in the .env file.");
  process.exit(1); // Exit if the URI is missing
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    migrateMessages();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const migrateMessages = async () => {
  try {
    const conversations = await Conversation.find();

    for (const conversation of conversations) {
      const { _id: conversationId, messages } = conversation;

      // Update each message with the conversationId
      await Message.updateMany(
        { _id: { $in: messages } },
        { $set: { conversationId } }
      );
    }

    console.log("Migration complete.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Migration error:", error);
    mongoose.disconnect();
  }
};
