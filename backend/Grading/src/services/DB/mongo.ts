import mongoose from "mongoose";
import dotenv from "dotenv";
import { setupAssignmentWatcher } from './dbWatcher';
dotenv.config();

export default async function mongo(): Promise<void> {
  mongoose.connection.on("connected", () => {
    console.log("connected to MongoDB");
    setupAssignmentWatcher(); 
  });

  mongoose.connection.on("error", (err: Error) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  console.log(process.env.MONGODB_URI);
  console.log(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.gpom6d9.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`);

  await mongoose.connect(
    process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.gpom6d9.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`,
    {}
  );
};