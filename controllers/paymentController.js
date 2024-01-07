const dotenv =require('dotenv')
dotenv.config({
    path:'./config/.env'
})
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require('../utils/asyncHandler')




const get_stripeApiKey=asyncHandler(async (req,res)=>{
    res.status(200).json({stripe_api_key:process.env.STRIPE_API_KEY})
})


const pay_payment=asyncHandler(async(req,res,next)=>{
    const myPayment= await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:'Inr',
        metadata:{
            company:'seomrush'
        }

    })
    res.status(200).json({success:true, client_secret:myPayment.client_secret})
})



module.exports={
    get_stripeApiKey,
    pay_payment
}