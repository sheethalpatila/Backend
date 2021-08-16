
const stripe = require("stripe")("sk_test_51JOdujSISqULftDDUMibEOn4O6SzDGXD0imwReCfFiRHnnRBrCM9aCr1BOJaW17321s8mbylfzixxkFwhmKkCjlO006Y9kr0MO");


const { v4: uuidv4 } = require('uuid');

exports.makePayment = (req,res) => {

    //extracting info first
    const {products,token} =req.body;
    console.log("PRODUCTS" , products);

    let amount =0;
    products.map(p => {
        amount=amount+p.price;
    });

    console.log(amount);

    //creating idempotencykey 
    const idempotencyKey = uuidv4();

    //create a customer , charging customer for thr products ,return response
    return stripe.customers.create({
        //providing info to create customer from token

        email:token.email,
        source:token.id
    }).then(customer => { 

        //if the customer is created then we can fire charges

        stripe.charges.create({  //give info the amout you want to deduct ,type of currency
            amount:amount,
            currency:"usd",
            customer:customer.id,
            reciept_email:token.email,
            description:"test accout",
            shipping:{
                //getting user info from toen only
                name:token.card.name,

                address:{
                line1:token.card.address_line1,
                line2:token.card.address_line2,
                city:token.card.address_city,
                state:token.card.address_state,
                acountry:token.card.address_country,
                postal_code:token.card.address_zip,

                }
                
              }
        } ,    {idempotencyKey})
        
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
    })
};



// "address_city": null,
// "address_country": null,
// "address_line1": null,
// "address_line1_check": null,
// "address_line2": null,
// "address_state": null,
// "address_zip": null,
// "address_zip_check": null,