import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
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
  }
},
{ timestamps : true});

export default mongoose.model("Product", productSchema);
