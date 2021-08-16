
const {Order , ProductCart } = require("../models/order")


exports.getOrderById = (req,res,next,id) => {

    Order.findById(id)
    .populate("products.product" , "name, price")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error : "NO order found in DataBase"
            })
        }
        req.order = order;
        next();
    });

};


exports.createOrder = (req,res) => {

    //oder schema is having user in order model so we use it to operate on user info 
    req.body.order.user = req.profile;

    const order = new Order(req.body.order)
    order.save((err,order) => {
        if(err){
            return res.status(400).json({
                error : " Failed to save your order in DB"
            })
        }
        res.json(order);
    });
};

exports.getAllOrders = (req,res) => {

    Order.find()
    .populate("user" ,"_id name")
    .exec((err,allOrders) => {
        if(err){
            return res.status(400).json({
                error: " Failed to load Orders in DB"
            })
        }
        res.json(allOrders);
    });
};


exports.getOrderStatus  = (req,res) => {
    //setting order status depending on enum written and situation 
    res.json(Order.schema.path("status").enumValues);
}

exports.updateStatus = (req,res) => {

    Order.updateMany(
        {_id:req.body.orderId},
        {$set : {status:req.body.status}},
        (err ,updatedOrderStatus) => {
            if(err){
                return res.status(400).json({
                    error:"Failed to updtae order status in DB"
                })
            }
            res.json(updatedOrderStatus);
        });
};