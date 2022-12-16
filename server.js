import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import deliveryAdressRoutes from "./routes/deliveryAdressRoutes.js";
import cors from "cors";
import path from "path";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import Razorpay from "razorpay";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
// ** MIDDLEWARE ** //
const whitelist = ["http://localhost:3000", "http://localhost:8080"];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable");
      callback(null, true);
    } else {
      console.log("Origin rejected");
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryAdressRoutes);
app.get("/api/config/razorpay", (req, res) =>
  res.send(process.env.RAZORPAY_KEY_ID)
);

app.post("/api/create-order", async (req, res) => {
  const { amount, receipt } = req.body;
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: amount + "00",
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    if (order) {
      res.send(order);
    } else {
      res.status(500);
      res.send("There was some error");
    }
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Api is running");
  });
}

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server running on port 5000"));