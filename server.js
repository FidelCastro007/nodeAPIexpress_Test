// Import required modules
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
app.use(express.json());

const PORT = process.env.PORT;

app.use(cors());

// Path to your products.json file
const productsFilePath = path.join(__dirname, 'products.json');

// Load products from the file (if it exists)
const loadProducts = () => {
  if (fs.existsSync(productsFilePath)) {
    const rawData = fs.readFileSync(productsFilePath);
    return JSON.parse(rawData);
  }
  return [];
};

// Save products to the file
const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Initialize products from the file
let products = loadProducts();
let productId = products.length ? products[products.length - 1].id + 1 : 1; // Start from the last ID

// POST API - Add a new product
app.post('/api/products', (req, res) => {
    console.log("Request Body:", req.body);  // Log the request body
    const { productName, productCode, category, manufacturer, marketing, dateOfManufacturing } = req.body;
  
    const product = {
      id: productId++,
      productName,
      productCode,
      category,
      manufacturer,
      marketing,
      dateOfManufacturing,
    };
  
    products.push(product);
    saveProducts(products);
  
    res.status(201).json({
      message: 'Product added successfully!',
      product,
    });
  });
  

// GET API - Get product details by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(prod => prod.id === parseInt(req.params.id));
  if (!product) {
    return res.status(400).json({ "message": `PRODUCT ID ${req.params.id} not found` });
  }
  res.json(product);
});

// GETALL API - Get all products  
app.get('/api/products', (req, res) => {
  res.json(products);
});

// DELETE API - Remove a product by ID
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === parseInt(id));

  if (productIndex !== -1) {
    products.splice(productIndex, 1);  // Remove from the products array
    saveProducts(products);  // Save updated list to file
    res.json({ message: 'Product deleted successfully!' });
  } else {
    res.status(404).json({ message: 'Product not found!' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
