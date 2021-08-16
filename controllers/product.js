const Product = require ("../models/product");
const formidable = require("formidable");
const _ =require("lodash");
const fs = require("fs"); //to access path of the file which is installed default
const { sortBy } = require("lodash");

exports.getProductById = (req,res,next,id) => {

    Product.findById(id)
    .populate("category") //to have product populated by category
    .exec((err , product) => {
        if(err){
            return res.status(400).json({
                error:"Product not found"
            })
        }
        req.product = product;
        next();
    })

};


exports.createProduct =(req,res) => {
    //creating form using formidable and it axpects 3 fields 1.error 2.field 3.files
    let form = new formidable.IncomingForm();
    form.keepExtensions =true;

    //parse form it allso expects 3 fields error,field,path
    form.parse(req,(err,fields,file) =>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }

        //destructuring the fields so that we dont have to call fields everysingle time and have clean data with restrictions
        const {name,description,price,category,stock} = fields;

        //restrictions 
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error:"Please include all fields"
            });
        }

        
        // create product
        let product = new Product (fields)
        //handle file here
        if(file.photo){
            //checking photo size and setting it //for 3 mb 1024*1024*3 calculation
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"the image file is bigger than 3mb in size"  
                })
            } 
            product.photo.data = fs.readFileSync(file.photo.path) //passing file to product using fs and formidable field
            product.photo.contentType = file.photo.type
        }

        // save to DB

        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error :"Saving in DB is Failed"
                })
            }
            res.json(product);
        });


    });
};


exports.getProduct = (req,res) => {

    req.product.photo = undefined; 
    
    //making photo undefined so if we want to use the product but images,mp3,vedio etc .. make complexity in return so and for the photo ,mp3 ,video is to be loaded we can create a middleware for  those , as we done in below method (exports.photo)
    
    return res.json(req.product);
};

 //middleware to photo 

 exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
      res.set("Content-Type", req.product.photo.contentType);
      return res.send(req.product.photo.data);
    }
    next();
  };


//for update product copy paste the create product method from above and remove destructurinf ,restriction for upload and the product = new product(because we are getting our product details from req.product => response comming from exports.getproductById above)

exports.updateProduct = (req,res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions =true;

    //parse form it allso expects 3 fields error,field,path
    form.parse(req,(err,fields,file) =>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }

    // update product
        let product = req.product;
        //using load-ash for controling arrays and extending (involving all products in one array or object so finding and update should be done accurately)

        product = _.extend(product,fields)


        //handle file here
        if(file.photo){
            //checking photo size and setting it //for 3 mb 1024*1024*3 calculation
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"the image file is bigger than 3mb in size"  
                })
            } 
            product.photo.data = fs.readFileSync(file.photo.path) //passing file to product using fs and formidable field
            product.photo.contentType = file.photo.type
        }

        // save to DB

        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error :"Updating product failed :" +product
                })
            }
            res.json(product);
        });


    });


}


//removing product

exports.removeProduct = (req,res) => {

    let product = req.product;
    product.remove((err,removingProduct) => {
        if(err){
            return res.status(400).json({
                error : "Failed to delete the product :" + removingProduct
            })
        }
        res.json({
            massage :"product Deletion was success :" + removingProduct
        })
    })

}


//getting all the products using limit,sortBy,select,populate

exports.getAllProducts = (req,res) =>{

    //use 8 as limit for listing products by default and if there are any limits provided by front end then use that limits to listing prodcts
    let limit = req.query.limit ? req.query.limit :8 
 
    //sorting product
    let sortBy = req.query.sortBy ? req.query.sortBy: "_id"
 
     Product.find()
     .sort([[sortBy,"asc"]])
     .populate("category") //involving category  
     .select("-photo") //what you dont want to return or not involeve
     .limit(limit)      // setting limit from limit variable defined above and execute 
     .exec((err,products) => {
         if(err){
             return res.status(400).json({
                 error: "Failed to load all products"
             })
         }
         res.json(products)
     })
 }


//get all categories

exports.getAllUniqueCategories =(req,res) => {
    Product.distinct("category" , {} , (err,category) => {
        if(err){
            return res.status(400).json({
                error : "Failed to get  unique category"
            })
        }
        res.json(category);
    });

};

//updating stock and sold in product details

exports.updateStock = (req,res) => {

    // loop through cart and getting all the details of the products

    let myOperations = req.body.order.product.map(prod => {
        return {
            updateOne : {
               filter : { _id : prod._id}, //filter based on prod id i have got
               update : {$inc : {stock: -prod.count ,sold :+prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations , {} ,(err,products =>{
        if(err){
            return res.status(400).json({
                error : "the bulk operation failed"
            })
        }
    }))
};



//for using formidable 
//=> simply decleare a form with formidable.incommingForm() 
// => simply parse the form as we have done above form.parse it gives you 3 items error field file see how we handled file above by giving size and saving it in database 