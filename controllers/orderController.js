const asyncHandler = require("../utils/asyncHandler");
const Order = require("../models/order");
const ApiErrorHandler = require("../utils/apiError");
const Product = require("../models/product");

const create_newOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItem,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItem,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res
    .status(200)
    .json({ success: true, order, message: "Order has been placed" });
});

const delete_order = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  await Order.findByIdAndDelete(id);
  res.status(200).json({ message: "Order delete", success: true });
});

const update_order = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (order.orderStatus === "Delivered") {
    return next(new ApiErrorHandler("Order Has been delivered"));
  }
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
    await updateStock(order.orderItem);
  }
  await order.save({ validateBeforeSave: false });

  const orders = await Order.find();

  res.status(200).json({ success: true, message: "Status Updated", orders });
});

async function updateStock(items) {
  items.forEach(async (item) => {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  });
}

module.exports = {
  create_newOrder,
  delete_order,
  update_order,
};
