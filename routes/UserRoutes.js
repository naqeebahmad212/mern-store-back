

const express=require('express')
const ApiErrorHandler = require('../utils/apiError')
const { register_user, login_user, logout_user, get_userDetails, update_userDetails, updated_password, forgotPassword, resetPassword, get_allUsersForAdmin, delete_user, update_user } = require('../controllers/userController')
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

router.post('/register',upload.single(),register_user)
router.post('/login',login_user)
router.get('/logout',logout_user)
router.get('/me', isAuthenticated,get_userDetails)
router.put('/update/me/:id',upload.single(), isAuthenticated,update_userDetails)
router.put('/update/password', isAuthenticated,updated_password)

router.post('/forgot/password',upload.single(),forgotPassword)

router.put('/password/reset/:token',upload.single(),resetPassword)

router.get('/admin/users',isAuthenticated,isUserAuthorize('admin'),get_allUsersForAdmin)
router.delete('/admin/user/:id',isAuthenticated,isUserAuthorize('admin'),delete_user)
router.put('/admin/user/:id',isAuthenticated,isUserAuthorize('admin'),update_user)
module.exports=router