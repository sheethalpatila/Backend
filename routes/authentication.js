var express = require('express');

const { check } = require('express-validator');

var router = express.Router();

const {signout,signup,signin ,isSignedIn} = require ("../controllers/authentication");



// read express validator first for using these below written can be change according to versions so clear the risk

router.post(
    "/signup" ,
[
    check("name" , "name must be at aleast 3 chars long").isLength({ min : 3}),
check("email","email is not valid").isEmail(),
check("password","password must be atleast 5 chars long").isLength({ min : 5})
] ,
signup );


//signin route
router.post(
    "/signin" ,
[
check("email","email is not valid").isEmail(),
check("password","password is required").isLength({ min : 1})
] ,
signin );


//signout route
router.get("/signout" ,signout );

router.get("/testrouter",isSignedIn, (req,res) =>{
    return res.json(req.auth)
});



module.exports = router;