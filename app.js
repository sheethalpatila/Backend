require('dotenv').config();

const mongoose = require('mongoose');

const express = require ("express");

const app = express();
const cookieParser = require ("cookie-parser");
const cors = require("cors");

// routes
const authenticationRoute = require ('./routes/authentication');
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const oderRoutes = require("./routes/order");

//payment
const stripeRoutes = require("./routes/stripePayment");
const { response } = require('express');


//using midlwares use by  reading documentations 

// bodyparser middleware BodyParse is built into Express js . So now you don't have to install body-parser, do this instead. its applied for Express v4.16.0 and higher

app.use(express.json());

//cookieParser middleware 
app.use(cookieParser());

//cors middleware 
app.use(cors());


// database connectivity section 
//if u use .env then write process.env.DATABASE use it instead of single quote and write thissingle quoted code in .env file 
const DATABASE = "mongodb+srv://sheethal:sapatil9164042089@cluster0.jffyz.mongodb.net/photography?retryWrites=true&w=majority";

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });
// mongoose.connect( 'mongodb+srv://sheethal:sapatil9164042089@cluster0.jffyz.mongodb.net/photography?retryWrites=true&w=majority ',
// {
//     useNewUrlParser: true,
//  useUnifiedTopology: true,
//  useCreateIndex:true
// }).then (() => {
//     console.log ("DB CONNECTED")
// }).catch ("DB is having problem ");


// routes 
app.use ("/api" , authenticationRoute);

app.use("/api" , userRoutes);

app.use ("/api" , categoryRoutes);

app.use ("/api" , productRoutes);

app.use("/api" , oderRoutes);

app.use("/api" , stripeRoutes);



//for do not exposing our database connection to others or securing from external objects we have used process.env.PORT 

const port = process.env.PORT || 9000;

//stating server 
app.listen (port , () => {
    console.log("app is running "+ port);
});