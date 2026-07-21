const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");

// Create Order (Customer)
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Step 1: Validate stock for all items first
    const productsToUpdate = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }
      productsToUpdate.push({ product, quantity: item.quantity });
    }

    // Step 2: Decrement stock and save products
    for (const update of productsToUpdate) {
      update.product.stock -= update.quantity;
      await update.product.save();
    }

    // Step 3: Create order
    const order = new Order({
      user: req.user._id,
      items: items.map(item => ({
        product: item.product,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity)
      })),
      totalAmount: Number(totalAmount),
      shippingAddress: shippingAddress || "Standard Delivery",
      status: "Success", // Default successful order creation
    });

    const savedOrder = await order.save();
    return res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Customer Orders (Customer)
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price imageURL")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "success", result: orders });
  } catch (error) {
    console.error("Get customer orders error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Orders (Admin)
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price imageURL")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "success", result: orders });
  } catch (error) {
    console.error("Get admin orders error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Success", "Failure", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If order was Success and is now Failure, we should restore product stock!
    if (order.status !== "Failure" && status === "Failure") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }
    // If order was Failure and is now Success/Pending, we should re-decrement stock!
    else if (order.status === "Failure" && (status === "Success" || status === "Pending")) {
      for (const item of order.items) {
        const prod = await Product.findById(item.product);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          await prod.save();
        }
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    return res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getAdminOrders,
  updateOrderStatus,
};
