const express=require('express')
const { createNewProduct, get_allProducts, get_productDetails, createAndUpdateReview, get_allAdminOrders, get_allAdminProducts, delete_product, update_product} = require('../controllers/productController')
const router=express.Router()
const {isAuthenticated, isUserAuthorize}=require('../middlewares/auth')

const multer=require('multer')
const path=require('path')
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/uploads'))
    },
    filename:function(req,file,cb){
        let name=Date.now()+'-'+file.originalname
        cb(null,name)
    }
})
const upload=multer({storage:storage,limits: { fieldSize: 25 * 1024 * 1024 }})

router.post('/new/product',isAuthenticated,isUserAuthorize('admin'),upload.single(),createNewProduct)
router.get('/products',get_allProducts)
router.get('/product/:id',get_productDetails)
router.post('/new/review',isAuthenticated,createAndUpdateReview)

router.get('/admin/products',isAuthenticated,isUserAuthorize('admin'),get_allAdminProducts)
router.get('/admin/orders',isAuthenticated,isUserAuthorize('admin'),get_allAdminOrders)
router.delete('/admin/product/:id',isAuthenticated,isUserAuthorize('admin'),delete_product)
router.put('/admin/product/edit/:id',isAuthenticated,isUserAuthorize('admin'),upload.single(),update_product)







module.exports=router