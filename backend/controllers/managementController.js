import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import TransactionModel from "../models/TransactionModel.js";

const getAdmin = async (req, res) => {
  try {
    const admins = await UserModel.find({ role: "admin" });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });

    const AFFILIATE_STATS_COLLECTION = "affiliatestats";
    const TRANSACTIONS_COLLECTION = "transactions";

    const matchUser = {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    };

    const joinAffiliateStats = {
      $lookup: {
        from: AFFILIATE_STATS_COLLECTION,
        localField: "_id",
        foreignField: "userId",
        as: "affiliateStats",
      },
    };

    const unwindAffiliateStats = {
      $unwind: {
        path: "$affiliateStats",
        preserveNullAndEmptyArrays: true,
      },
    };

    const joinSaleTransactions = {
      $lookup: {
        from: TRANSACTIONS_COLLECTION,
        localField: "affiliateStats.affiliateSales",
        foreignField: "_id",
        as: "affiliateStats.saleTransactions",
      },
    };

    const userWithStats = await UserModel.aggregate([
      matchUser,
      joinAffiliateStats,
      unwindAffiliateStats,
      joinSaleTransactions,
    ]);

    if (!userWithStats.length)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { affiliateStats } = userWithStats[0];

    // User exists but has no affiliate stats yet — not an error, just empty data.
    const saleTransactions = affiliateStats?.saleTransactions ?? [];

    res.status(200).json({ success: true, stats: saleTransactions });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export { getAdmin, getUserPerformance };
