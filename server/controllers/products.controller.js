import axios from "axios";
import { Product } from "../models/Product.js";
export const seedProducts = async (req, res) => {
  const URL = process.env.PRODUCTS_URL;

  try {
    // fetch products
    const { data } = await axios.get(URL);

    // prepare products to insert
    const productsToInsert = [];

    // check existing products
    for (const product of data) {
      const existingProduct = await Product.findOne({
        title: product.title,
      });

      if (!existingProduct) {
        productsToInsert.push(product);
      }
    }

    if (productsToInsert.length > 0) {
      const result = await Product.insertMany(productsToInsert);
      res
        .json({
          message: "Products Added",
          success: true,
          data: result,
        })
        .status(200);
    } else {
      res
        .json({
          message: "No new products to insert",
          success: false,
        })
        .status(204);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
