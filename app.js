require('dotenv').config();  // Load environment variables from .env file

const mongoose = require('mongoose');
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// routes
const authenticationRoute = require('./routes/authentication');
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripePayment");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Database connectivity
const DATABASE = process.env.DATABASE || "mongodb://localhost:27017/photography"; // Fallback to localhost if env var is missing

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(err => {
    console.error("DB CONNECTION ERROR:", err);
  });

// Routes
app.use("/api", authenticationRoute);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);

// Port configuration using environment variable
const port = process.env.PORT || 9000;

// Starting the server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
