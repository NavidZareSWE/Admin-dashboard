import mongoose from "mongoose";

const AffiliateStatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    affiliateSales: {
      type: [mongoose.Types.ObjectId],
      ref: "Transaction",
    },
  },
  { timestamps: true },
);

const AffiliateStatModel =
  mongoose.models.affiliateStat ||
  mongoose.model("affiliateStat", AffiliateStatSchema);

export default AffiliateStatModel;
