import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderCourse, paymentMethod, coursePrice, taxPrice, totalPrice } =
    req.body;

  if (orderCourse && orderCourse.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderCourse,
      user: req.user._id,
      paymentMethod,
      coursePrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(200);
    res.json(createdOrder);
  }
});

const updateOrderAdress = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { number, address, city, state, postalCode } = req.body;
  if (order) {
    order.shippingAdress.number = number;
    order.shippingAdress.address = address;
    order.shippingAdress.city = city;
    order.shippingAdress.state = state;
    order.shippingAdress.postalCode = postalCode;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      OrderId: req.body.id,
      paymentId: req.body.paymentId,
      signature: req.body.signature,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name email");
  res.json(orders);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.remove();
    res.json({ message: "Order deleted sucessfully" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderAdress,
  getMyOrders,
  getOrders,
  deleteOrder,
};
