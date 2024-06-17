import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  sold: Boolean,
  dateOfSale: String,
});

export const Product = mongoose.model("Product", productSchema);
