import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("connected", conn.connection.host);
  } catch (error) {
    console.log("Mongodb error", error);
  }
};