import asyncHandler from "express-async-handler";
import Coupons from "../models/coupons.js";

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupons.find();

  res.json(coupons);
});

export { getCoupons };
