import mongoose from "mongoose";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log("Error Connecting To MonogoDb", error.message);
  }
};

export default connectToMongoDb;
