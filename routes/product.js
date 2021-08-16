const express = require("express");
const router = express.Router();

const { getProductById, createProduct ,getProduct, photo ,updateProduct ,removeProduct ,getAllProducts ,getAllUniqueCategories } = require("../controllers/product");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/authentication");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("productId", getProductById);


//all of actual routes
//create route
router.post(
  "/product/create/:userId", isSignedIn, isAuthenticated, isAdmin,
  createProduct
);

//read route

router.get("/product/:productId" , getProduct);
//for making product.photo undefined and writing exports.photo method
router.get("/product/photo/:productId" , photo);

//update route
router.put("/product/:productId/:userId" , isSignedIn , isAuthenticated,isAdmin , updateProduct);
//delete route
router.delete("/product/:productId/:userId" , isSignedIn,isAuthenticated ,isAdmin , removeProduct);

//listing route
router.get("/product" , getAllProducts);

//
router.get("/product/categories" , getAllUniqueCategories);

module.exports = router;
