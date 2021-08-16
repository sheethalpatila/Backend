var express = require('express')
var router = express.Router()


const {makePayment} = require("../controllers/stripePayment")
//somebody hits stripe routes


router.post("/stripePayment" ,makePayment)



module.exports = router;