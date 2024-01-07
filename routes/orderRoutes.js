const express=require('express')
const { create_newOrder, delete_order, update_order } = require('../controllers/orderController')
const { isAuthenticated, isUserAuthorize } = require('../middlewares/auth')
const router=express.Router()


router.post('/new/order',isAuthenticated,create_newOrder)

router.delete('/admin/order/:id',isAuthenticated,isUserAuthorize('admin'),delete_order)
router.put('/admin/order/:id',isAuthenticated,isUserAuthorize('admin'),update_order)

module.exports=router