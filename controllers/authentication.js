const User  = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const { check, validationResult } = require("express-validator");

exports.signup =(req,res) => {
    // console.log("body",req.body);
    
// this binds express validatior binds validation results request body 

const errors = validationResult(req);

if (!errors.isEmpty()) {
    // status 422 is for database 
    return res.status(422).json({
        error:errors.array()[0].msg // for only msg
        // or  errror:errors.array() for all  means body ,msg ,parameter
    });
}

    // craeting a class object 
    const user = new User(req.body);

    // saving user data in user object of database
    user.save((err,user)=> {
        // console.log(user);
        // console.log(err);

        // if error comes
        if (err){
            return res.status(400).json({
                err:"the data you are trying to save in user data its not saving in DataBase"
            });
            //if there is no error then display
        } 
        res.json({
            name:user.name,
            email:user.email,
            id:user._id
        });
    });
};


//sign in controllers which include authentication process by using user info and generating tokens for helping the process

exports.signin = (req ,res) => {


// this binds express validatior binds validation results request body
    const errors = validationResult(req);
    //body have all the values like mail , name , password,id 
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        // status 422 is for database 
        return res.status(422).json({
            error:errors.array()[0].msg // for only msg
            // or  errror:errors.array() for all  means body ,msg ,parameter
        });
    }

    //find one function is used to find the exact match and it is more efficient in doing that 

    User.findOne({ email } , (err,user) => {

        //checking userr email is exist in database or not to authenticate
        if(err || !user ){
            res.status(400).json({
                error:"user email does not exist"
            });
        }

        //check user enterd password matches or not by using authenticate fucntion in user 
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and Password do not match"
            });
        }

        // if there is no error then we need to create a token and put into coockies and allow user to sign in by creating and using express-jwt

        //creating token using user id which comes from user data
        const token = jwt.sign({_id: user._id} , process.env.SECRET)

        //put token in cookie 

        res.cookie("token" , token , {expire : new Date() + 9999});

        //send response to front-end
        const {_id , name , role } = user;

        return res.json({ token, user :{_id , name , email, role} });
    });
};


exports.signout = (req,res) => {

    // clear the cookie because you can clear the token so then there will be no access to source without token
res.clearCookie("token");

    res.json({
        message : "user sign-out successfully"
    });
};

//protected routes using express -jwt

exports.isSignedIn = expressJwt({
    //secret :process.env.SECRET
    secret: 'photography',
    userProperty : "auth"
})


// custom middleware

exports.isAuthenticated = (req,res,next) => {

    // here we create checker to check the user is authenticated or not (by setting a property so that if user is logged in with their imp id ,email,password then this property is set) 
    // and here in below code you can see req.profile is going to set by frontend  and 
    // req.auth is set by using above written isLoggedIn 
    // and req.profile._id is set by front end and compared with req.profile._id comming from middleware (isLoggedin)
    let checker =  req.profile && req.auth && req.profile._id == req.auth._id;

    // condition if checker din't worked 
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED"
        });

    }

    next();
}

exports.isAdmin = (req,res,next) => {

    // simple check the user is admin or not by 

    if(req.profile.role ==0){
        res.status(403).json({
            error:"you are not admin ,Access denied"
        });
    }
    next();
};
