const port = 2924;

const express = require('express');

const app = express();

const productsController = require('./controller/products.controller')

app.use(express.json());
app.use("/products", productsController)


module.exports = {port,app}