import express from "express";
import { getCoupons } from "../controllers/couponsController.js";

const router = express.Router();

router.route("/getmycoupons").get(getCoupons);
export default router;
