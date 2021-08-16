const User = require("../models/user");
const order = require("../models/order");

// method to grab user details using id (middleware using param)
exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {

        if(err || !user){

            return res.status(400).json({
                error : "no user was found in DB"
            });

        } 
        // if user found then storing in a profile or variable and dont forrget to call next() function after functionalities are written

        req.profile = user
        next();
    });
};

//simple method to grab user details using above method getUserById response
exports.getUser = (req,res) => {

    // making undefined those which are should not come in response (get ) , whenever we call user details  ony in this but those are actually  goint to save in database so dontworry 
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt =undefined ;
    req.profile.updatedAt = undefined ;

    
    return res.json(req.profile);
};


// update user details or profile
exports.updateUser = (req,res) => {
    User.findByIdAndUpdate (
        { _id : req.profile._id},// we are making request at the route with :userId so middleware is gonna fireup automatically which is gonna be userId and which populates field req.profile._id and
        {$set:req.body},// sets it up by using findbyIdAndUpdate 
        {new : true , userFindAndModify : false},
        (err , user ) => {
            if(err){
                return res.status(400).json({
                    error: " You are not authorized to update user"
                })
            }

            //we are recieving user details and we dont want everything about user so undefining salt and password and data is comming to user so user.salt

            user.salt = undefined;
            user.encry_password = undefined;

            //finally the response without unwanted values
            res.json(user)
        }

    );
};


//pushing orders in user purchase list using populate
exports.userPurchaseList =(req,res) => {

    //bring order schema  import order from models 
    //usage of populate (to populate user details and the orders on their id )
    // we are pulling these information from order model and we are selecting depending on req.profile._id (which basically do push the orders depending on the user id)

    order.find({user:req.profile._id})
    .populate("user","_id name")
    .exec((err , order) => {
        if(err){
            return res.status(400).json({
                error : "No order in this Account"
            })
        }
        return res.json(order);
    });

};

//middleware push order in purchase list
exports.pushOrderInPurchaseLis = (req,res ,next) =>{
    //in user module purchase is a type of a array so we use method push
    //it will be comming from body.order
    //whatever the products we have we are going to loop through that we pick up indiual information from there we will create an obbject from it we will pushing it inside the purchaselist

    let purchases = []
    req.body.order.products.forEach(product =>{

        //use this array purchases and use method push object with product id and product name and etc
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_Id:req.body.transaction_Id
        });
    });
//store this in data base by using find one & update by using id (comming from req.profile.id) 
//and updating purchases by local purchases
     User.findOneAndUpdate(
         {id:req.profile._id} ,
         {$push : {purchases: purchases}},
         {new : true}, //we need to push the new order to update not existing so new :true is used
         (err , purchases) => {
             if(err){
                 return res.status(400).json({
                     error:"unable to save to purchase list"
                 })
             }
             next();
         }
    )
};


























// get the all users data 
// exports.getAllUsers = (req,res) =>{
//     User.find().exec( (err,users)=> {
//         if(err || !users ){
//             return res.status(400).json({
//                 error:"no users found"
//             });
//         }
//         res.json(users);
//     });
// };