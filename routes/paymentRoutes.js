const express=require('express')
const { get_stripeApiKey, pay_payment } = require('../controllers/paymentController')
const { isAuthenticated } = require('../middlewares/auth')
const router=express.Router()



router.post('/payment/procces',isAuthenticated,pay_payment)
router.get('/stripeapikey',get_stripeApiKey)






module.exports=router