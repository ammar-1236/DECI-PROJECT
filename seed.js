require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");

const Category = require("./models/category.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");

const seedDatabase = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    const categories = await Category.insertMany([
      {
        name: "Electronics",
        description: "Electronic devices",
        slug: "electronics",
      },
      {
        name: "Clothing",
        description: "Fashion products",
        slug: "clothing",
      },
      {
        name: "Books",
        description: "Books and novels",
        slug: "books",
      },
    ]);

    const products = [
      {
        name: "iPhone 16",
        description: "Apple smartphone",
        price: 1200,
        stock: 15,
        category: categories[0]._id,
        images: ["iphone.jpg"],
      },
      {
        name: "Laptop",
        description: "Gaming laptop",
        price: 1800,
        stock: 10,
        category: categories[0]._id,
        images: ["laptop.jpg"],
      },
      {
        name: "T-Shirt",
        description: "Cotton T-Shirt",
        price: 25,
        stock: 50,
        category: categories[1]._id,
        images: ["shirt.jpg"],
      },
      {
        name: "Jeans",
        description: "Blue Jeans",
        price: 45,
        stock: 30,
        category: categories[1]._id,
        images: ["jeans.jpg"],
      },
      {
        name: "Clean Code",
        description: "Programming Book",
        price: 40,
        stock: 20,
        category: categories[2]._id,
        images: ["clean-code.jpg"],
      },
      {
        name: "Atomic Habits",
        description: "Self-development Book",
        price: 30,
        stock: 25,
        category: categories[2]._id,
        images: ["atomic-habits.jpg"],
      },
    ];

    await Product.insertMany(products);

    console.log(
      `Database Seeded Successfully!
Categories: ${categories.length}
Products: ${products.length}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  }
};

seedDatabase();