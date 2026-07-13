import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI)
    throw new Error("MONGODB_URI is not set. Refusing to connect.");
  if (!process.env.DB_NAME)
    throw new Error("DB_NAME is not set. Refusing to connect.");

  const DB_NAME = process.env.DB_NAME;
  // Guard against a second call creating a duplicate connection attempt.
  // readyState values are documented: 0=disconnected, 1=connected,
  // 2=connecting, 3=disconnecting.
  // Source: https://mongoosejs.com/docs/api/connection.html#Connection.prototype.readyState
  if (mongoose.connection.readyState === 1) return mongoose;

  mongoose.connection.on("connected", () => {
    // connection.name is documented as "The name of the database this
    // connection points to."
    // Source: https://mongoosejs.com/docs/api/connection.html#Connection.prototype.name
    console.log(`Connected to MongoDB database: "${mongoose.connection.name}"`);
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
    });

    // Belt-and-braces: assert the actual connected db matches what you
    // expect, in case dbName is ever removed/typo'd in a future edit.
    if (mongoose.connection.name !== DB_NAME) {
      throw new Error(
        `Connected to "${mongoose.connection.name}" instead of expected "${DB_NAME}"`,
      );
    }

    return mongoose;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    // Don't let Express/your app boot and start serving requests against
    // a database that never actually connected — this is a real gap in
    // your original code, since console.dir(err) alone lets execution continue.
    process.exit(1);
  }
};

export default connectDB;

export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}
