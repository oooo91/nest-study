import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  order: {
    type: Number,
    requird: true,
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["FOR_SALE", "SOLD_OUT"],
    default: "FOR_SALE",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
