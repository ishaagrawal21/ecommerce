const Product = require("../model/ProductModel");
const Category = require("../model/CategoryModel");
const User = require("../model/UserModel");

// GET ADMIN DASHBOARD STATS
const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();

    const products = await Product.find();
    const totalInventoryValue = products.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const avgPrice = totalProducts > 0 ? (totalInventoryValue / totalProducts).toFixed(2) : 0;

    return res.status(200).json({
      message: "success",
      stats: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        avgPrice: Number(avgPrice),
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL USERS FOR ADMIN
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      message: "success",
      result: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
};
