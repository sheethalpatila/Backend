//this file is for adding category like summer collection ,winter collection etc...

const mongoose = require ("mongoose");


const categorySchema = new mongoose.Schema({


    name : {
        type:String,
        trim:true,
        required:true,
        maxlength:32,
        unique:true
    }
    

},

// for saving time and date whenever the category is going to added

{timestamps:true}

);

module.exports = mongoose.model("Category" , categorySchema);
