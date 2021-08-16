const Category = require("../models/category");



exports.getCategoryById = (req,res,next, id) => {

    // whatever we see in parameter first we will extract that using method findbyId

    Category.findById(id).exec((err , cate) => {

        if(err){
            return res.status(400).json({
                error:"Category not found in Db"
            });
        }
        req.category = cate;
        next();
    })
};


// creating category 
exports.createCategory = (req,res) => {
    // creating category which we will extract user body

    const category = new Category(req.body);
    category.save((err,category) => {
        if(err) {
            return res.status(400).json({
                error: "Not able to save category in DB"
            });
        }
        res.json({category});
    });
};

// get a sing category by using categorbyid
exports.getCategory = (req,res) => {
  //we can get our category id by above method getcategorybyid and if you just want one category then simply populate it from createcategory method
      return res.json(req.category);
};



//get all the categories
exports.getAllCategory =(req,res ) => {
   // getting all the categories by find
   
     Category.find().exec((err , categories) => {
         if(err) {
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(categories);
     })
};

//update category  by using category id and user id

exports.updateCategory = (req,res ) => {
     // first grab category  from the middlware response getcategorybyid
     const category = req.category;
     //grab required category elements sending from the front end or postman
     category.name = req.body.name;

     //updating 

     category.save((err , updatedCategory) => {
         if (err){
             return res.status(400).json({
                 error :"Failed to update category"
             });
         }
         res.json(updatedCategory);
     });

};

// removing category 
exports.removeCategory = (req,res) => {

    // first grab category  from the middlware response getcategorybyid
    const category = req.category;

    category.remove((err,categoryRemoved) => {
        if (err) {
            return res.status(400).json({
                error :"Failed to remove or delete the category "
            });
        }
        res.json({
            massage : "successfully category is removed : " + categoryRemoved.name
        });
    });
};