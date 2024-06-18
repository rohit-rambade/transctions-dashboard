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

export const getStatistics = async (req, res) => {
  try {
    const { month } = req.query || 1;
    console.log(month);
    if (!month) {
      return res.status(400).json({
        message: "Month parameter is required",
        success: false,
      });
    }

    const allProduct = await Product.find();

    let soldItems = 0;
    let notSoldItems = 0;
    const selectedProducts = allProduct.filter((product) => {
      const date = new Date(product.dateOfSale);
      const [monthOfSale] = [
        // date.getUTCFullYear(),
        date.getUTCMonth() + 1,
      ];

      if (parseInt(month) === monthOfSale && product.sold) {
        soldItems++;
        return product;
      }
      notSoldItems++;
    });
    const totalSaleAmount = selectedProducts.reduce((total, product) => {
      return total + product.price;
    }, 0);

    res.json({
      success: true,
      data: {
        totalSaleAmount,
        soldItems,
        notSoldItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

function getPriceRange(price) {
  if (price <= 100) return "0-100";
  if (price <= 200) return "101-200";
  if (price <= 300) return "201-300";
  if (price <= 400) return "301-400";
  if (price <= 500) return "401-500";
  if (price <= 600) return "501-600";
  if (price <= 700) return "601-700";
  if (price <= 800) return "701-800";
  if (price <= 900) return "801-900";
  return "901-above";
}
export const barChart = async (req, res) => {
  try {
    const { month } = req.query || 1;
    console.log(month);
    if (!month) {
      return res.status(400).json({
        message: "Month parameter is required",
        success: false,
      });
    }

    const allProduct = await Product.find();

    const selectedProducts = allProduct.filter((product) => {
      const date = new Date(product.dateOfSale);
      const [monthOfSale] = [date.getUTCMonth() + 1];

      if (parseInt(month) === monthOfSale) {
        return product;
      }
    });
    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };
    console.log(selectedProducts);
    selectedProducts.forEach((product) => {
      const priceRange = getPriceRange(product.price);
      priceRanges[priceRange]++;
    });

    res.status(200).json({
      success: true,
      data: {
        priceRanges,
      },
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const pieChart = async (req, res) => {
  try {
    const { month } = req.query || 1;
    console.log(month);
    if (!month) {
      return res.status(400).json({
        message: "Month parameter is required",
        success: false,
      });
    }

    const allProduct = await Product.find();

    const selectedProducts = allProduct.filter((product) => {
      const date = new Date(product.dateOfSale);
      const [monthOfSale] = [date.getUTCMonth() + 1];

      if (parseInt(month) === monthOfSale) {
        return product;
      }
    });
    const categoryCounts = {};

    selectedProducts.forEach((product) => {
      const category = product.category;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });

    res.status(200).json({
      data: categoryCounts,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
