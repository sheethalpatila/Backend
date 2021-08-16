const express = require("express");


const app = express();

const port = 3000;

app.get("/",(req,res) => {
    return  res.send("hello welcome to home page");
});
app.get("/login" , (req,res) => {
    return res.send("hello welcome please login ")
});
app.get("/signup" , (req,res) => {
    return res.send("hello welcome please login ")
});
app.get("/signin" , (req,res) => {
    return res.send("hello welcome please login ")
});

app.get("/logout",(req,res) => {
    return  res.send("thank you for using our website,take care ,we assume we will see you soon");
});

app.listen(port, () => {
    console.log("server is running...");
});








// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
