import mongoose from "mongoose";

const connectDB = async () => {
  // Set up an event listener for when the connection is successfully established
  mongoose.connection.on("connected", () => {
    console.log("You successfully connected to MongoDB!");
  });
  try {
    // Connect to the MongoDB database using the connection string from environment variables, specifically connecting to the "admin-dashboard-NZSWE" database
    await mongoose.connect(`${process.env.MONGODB_URI}/admin-dashboard-NZSWE`);
    return mongoose;
  } catch (err) {
    console.dir(err);
  }
};
export default connectDB;

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}
