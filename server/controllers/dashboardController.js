import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/Users.js";
import Request from "../models/Request.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalRequests = await Request.countDocuments();
    const approvedRequests = await Request.countDocuments({
      status: "Approved",
    });
    const pendingRequests = await Request.countDocuments({
      status: "Pending",
    });
    const rejectedRequests = await Request.countDocuments({
      status: "Rejected",
    });

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalRequests,
        approvedRequests,
        pendingRequests,
        rejectedRequests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};