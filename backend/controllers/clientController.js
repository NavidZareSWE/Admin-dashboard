import ProductModel from "../models/ProductModel.js";
import userModel from "../models/UserModel.js";

const getProducts = async (req, res) => {
  try {
    const productsWithStat = await ProductModel.aggregate([
      {
        $lookup: {
          from: "productstats",
          localField: "_id",
          foreignField: "productId",
          as: "stat",
        },
      },
    ]);

    res.status(200).json({ success: true, productsWithStat });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await userModel.find({ role: "user" });
    res.status(200).json({ success: true, customers });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { getProducts, getCustomers };
