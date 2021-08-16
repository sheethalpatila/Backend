const mongoose = require ("mongoose");
const {ObjectId} = mongoose.Schema ;

const ProductCartSchema = new mongoose.Schema({

    product :{
        type :ObjectId,
        ref : "product"
    },
    name :String,
    count : Number,
    price : Number ,

});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

const orderSchema = new mongoose.Schema({

    // products which are in the the cart 

    products : [ProductCartSchema], 

    transaction_Id : {},
    amount : {type :Number},
    address : { type :String },

    statue : { 
        type:String ,
        default : "Recieved",
        enum : ["Cancelled" , "Delivered" , "Shipped" , "Processing" ,"Recieved"]
    }, // writing enums so  the order status and position can be hendled

    user :  { 
    type : ObjectId ,
    ref:"user" }

   } , {timestamps : true}

);

const Order = mongoose.model("Order",orderSchema);

module.exports = {Order , ProductCart };