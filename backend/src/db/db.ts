import mongoose from "mongoose";

const connectToDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_DB_CONNECTION_STRING;

    if (!mongoURI) {
      throw new Error("MONGO_DB_CONNECTION_STRING error !!");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectToDB;