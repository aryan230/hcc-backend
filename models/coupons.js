import mongoose from "mongoose";

const CouponsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
    },
    typeOfCoupon: {
      type: String,
      default: "Percentage",
    },
    criteria: {
      type: Number,
    },
    description: {
      type: String,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Coupons = mongoose.model("Coupons", CouponsSchema);

export default Coupons;
