// back end file ,this is used to structure  the how user data should be stored 

var mongoose = require('mongoose');

const  crypto  =  require('crypto');
const { v4: uuidv4 } = require('uuid');

//Schema is an object that defines the structure of any documents that will be stored in your MongoDB collection; it enables you to define types and validators for all of your data 


var userSchema = new mongoose.Schema({

    name: {
        type:String,
        required:true,
        maxlength:32,
        trim:true
        
    },
    lastname: {
        type:String,
        maxlength:32,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true

    },
    userinfo :{
        type : String,
        trim : true

    },

    encry_password:{
        type:String,
        required:true
    },

    salt : String,

    role :{
        type:Number,
        default: 0
    },

    purchases :{
        type : Array,
        default : []

    }

},
// storing date , time whenever the data of user is going to save
{timestamps:true}
);

//creating a vitual schema https://mongoosejs.com/docs/tutorials/virtuals.html

userSchema.virtual("password")
.set(function(password){
    this._password = password ;
    this.salt = uuidv4();;
    this.encry_password = this.securePassword(password);

})
.get(function(){
    return this._password;
});

userSchema.methods = { authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },

// securing or encripting the password with the help of cripto 

    securePassword : function(plainpassword){

        if (!plainpassword)return "";

        try{
            return crypto
            .createHmac("sha256", this.salt)
            .update(plainpassword)
            .digest("hex");
           }catch(err){
            return"";
        }
    }
};

module.exports = mongoose.model("User", userSchema);
//Mongoose is a JavaScript library that allows you to define schemas with strongly typed data. Once a schema is defined, Mongoose lets you create a Model based on a specific schema. A Mongoose Model is then mapped to a MongoDB Document via the Model's schema definition.