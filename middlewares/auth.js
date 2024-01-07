const ApiErrorHandler = require("../utils/apiError")
const User=require('../models/userModel')
const jwt=require('jsonwebtoken')

const isAuthenticated=(req,res,next)=>{
    const token=req.cookies.jwtToken
    if(!token){
        next(new ApiErrorHandler('Login to Access the resource',401))
    }else{
        jwt.verify(token,process.env.SECRET,async(err,userInfo)=>{
            if(err){
               next(new ApiErrorHandler('Login to Access the resource',401))
            }else{
                req.user= await User.findById(userInfo.id)
                next()
            }
        })
    }
}


const isUserAuthorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next  (new ApiErrorHandler(`Role : ${req.user.role} is not allowed to access this route`,403 ))

        }else{
            next()
        }
    }
}


module.exports={
    
    isAuthenticated,
    isUserAuthorize
}