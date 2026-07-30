import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, min: 2, max: 500 },
    cost: { type: Number, required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

const TransactionModel =
  mongoose.models.transaction ||
  mongoose.model("transaction", TransactionSchema);

export default TransactionModel;
