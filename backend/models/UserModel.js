import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 2, max: 100 },
    email: { type: String, required: true, max: 500, unique: true },
    password: {
      type: String,
      required: true,
      min: 12,
      max: 120,
      select: false,
    },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    occupation: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    transactions: { type: Array, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      required: true,
      default: "user ",
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

export default UserModel;
