import userModel from "../models/userModel.js";

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { getUser };
