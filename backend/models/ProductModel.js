import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 2, max: 500 },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    supply: { type: String, required: true },
  },
  { timestamps: true },
);

const ProductModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default ProductModel;
