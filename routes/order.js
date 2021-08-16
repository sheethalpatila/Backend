
const express = require("express");
const router = express.Router();


const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/authentication");
const { getUserById ,pushOrderInPurchaseLis} = require("../controllers/user"); 
const {updateStock} = require("../controllers/product");

const {getOrderById ,createOrder ,getAllOrders ,getOrderStatus ,updateStatus} = require("../controllers/order");



//params
router.param("/userId" , getUserById);
router.param("orderid" , getOrderById);


//actual routes
//create
//pushing order in purchase list ,update stock,create order 
router.post("/order/create/:userId", 
isSignedIn , 
isAuthenticated ,
pushOrderInPurchaseLis ,
updateStock ,
createOrder );

//read routes

router.get("/order/all/:userId" , isSignedIn ,isAuthenticated ,isAdmin , getAllOrders);

//status of order
router.get("/order/status/:userId"  ,isSignedIn ,isAuthenticated ,isAdmin , getOrderStatus);

router.put("/order/:orderId/status/:userid" ,isSignedIn ,isAuthenticated ,isAdmin ,updateStatus);

//write another route if user can allso see status



module.exports = router ;

