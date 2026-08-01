import OverallStatModel from "../models/OverallStatModel.js";

const getSales = async (req, res) => {
  try {
      const overallStats = await OverallStatModel.find();
      
    res.status(200).json({ success: true, SalesStats: overallStats[0] });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { getSales };
