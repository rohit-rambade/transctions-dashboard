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

export const listAllTransactions = async (req, res) => {
  try {
    // get query parameters
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const query = {
      $or: [
        { title: { $regex: `\\b${search}\\b`, $options: "i" } },
        { description: { $regex: `\\b${search}\\b`, $options: "i" } },
      ],
    };

    // Add Query For Price
    const searchNumber = parseFloat(search);
    if (!isNaN(searchNumber)) {
      query.$or.push({ price: searchNumber });
    }
    if (!search) {
      delete query.$or;
    }
    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);
    console.log(transactions);
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
