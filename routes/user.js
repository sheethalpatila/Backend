const express = require ("express");
const router = express.Router();

const {getUserById ,getUser ,updateUser , userPurchaseList} = require("../controllers/user");
const {isSignedIn ,isAuthenticated ,isAdmin} = require("../controllers/authentication");


// write router middelware uisng param 

router.param("userId" ,getUserById); // whenever there is something in router ex ":" symbol or something that will be interpretered as user id and this method automatically populate request.profile object with user object thats comming up from  user data base 

//route for getting user details using the response from above route getUserById from controller/getUser
router.get("/user/:userId" ,isSignedIn,isAuthenticated, getUser);
// before user getting the acces checking the authentication by is signed in , aunticated? , is a admin ? , then allowing with the checking 


//route for update user details
router.put("/user/:userId" , isSignedIn,isAuthenticated ,updateUser);

// route for user orders
router.get("/orders/user/:userId" , isSignedIn,isAuthenticated , userPurchaseList);







//getting all the users and their details 
// dont forgrt to import  "getAllUsers" in controllers/user baove
// router.get("/allusers" , getAllUsers);


module.exports =router;
