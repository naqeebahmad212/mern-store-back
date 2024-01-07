const ApiErrorHandler = require("../utils/apiError")
const asyncHandler=require('../utils/asyncHandler')
const cloudinary=require('cloudinary')
const User=require('../models/userModel')
const sendToken  = require("../utils/sendToken")
const bcrypt=require('bcrypt')
const sendEmail = require("../utils/sendEmail")
const crypto=require('crypto')
const register_user=asyncHandler(
    async(req,res,next)=>{
        
        if(req.body.file !== '' && req.body.file !== undefined){ 
            let image=''
            const result=await cloudinary.v2.uploader.upload(req.body.file,{
                folder:'products'
            })
            image={
                url:result.secure_url,
                public_id:result.public_id
            }
            req.body.image=image
        }
        // const {name,email,password}=req.body
    
    const user =await User.create(req.body)
    
    res.status(201).json({success:true, user})
    
    }
)




const login_user=asyncHandler(async(req,res,next)=>{
    const {email, password}=req.body
  
    const user=await User.findOne({email}).select('+password')
    if(!user){
        return next(new ApiErrorHandler('Invalid Credentials',401))
    }else{
        const auth= await bcrypt.compare(password,user.password)
        if(!auth){
           return next(new ApiErrorHandler('Invalid Credentials',401))
       }else{
        sendToken(user,res,201)
       }
    }
})


const logout_user=(req,res,next)=>{
    res.cookie('jwtToken','',{maxAge:0}).json({succuss:true})
}


const get_userDetails=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user._id)
    if(!user){
        next(new ApiErrorHandler('UnAuthorize', 401))
    }
    res.status(200).json({user,success:true})
})


const update_userDetails=asyncHandler(async(req,res,next)=>{
    const id=req.params.id
    const user = await User.findById(id)
    if(!user){
        return next(new ApiErrorHandler('User not found',404))
    }
    if(req.body.file !== '' && req.body.file !== undefined){
        await cloudinary.v2.uploader.destroy(user.image.public_id)
        const result= await cloudinary.v2.uploader.upload(req.body.file,{
            folder:'products'
        })
        req.body.image={url:result.secure_url,public_id:result.public_id}
        
    }
    
     await User.findByIdAndUpdate(id,
       req.body
    )

    res.status(200).json({success:true})
})


const updated_password=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user._id).select('+password')
    const {newPassword, currentPassword}=req.body
    const isCurrentPasswordCorrect= await user.comparePassword(currentPassword)
    if(!isCurrentPasswordCorrect){
        return next(new ApiErrorHandler('Incorrect old password',401))
    }else{
        const isOldPasswordMatch= await user.comparePassword(newPassword)
        if(isOldPasswordMatch){
            return next(new ApiErrorHandler('New Password cannot be same',401))
         }else{
             user.password=newPassword
             user.save()
             res.status(200).json({success:true})
         }

    }

})


const forgotPassword=asyncHandler(async (req,res,next)=>{

const user = await  User.findOne({ email: req.body.email})
if(!user){
    return next(new ApiErrorHandler('Invalid Email',404))
}

// reset password token
const resetToken=user.getResetPasswordToken();
 await user.save()

 const resetPasswordUrl=`${req.protocol}:${req.get('host')}/password/reset/${resetToken}`
 const message=`Your password recovery link is below :- \n\n ${resetPasswordUrl} \n If  you did not request it if please  ignore`;


try {
    sendEmail({
        email:user.email,
        message,
        subject:'Password recovery'
    
     })

     res.status(200).json({message:'Email was to sent to your register email',succuss:true})
} catch (err) {
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined
    await user.save()

    return next(new ApiErrorHandler(err.message,500))
}

})



const resetPassword=asyncHandler(async(req,res,next)=>{
    
    const token=req.params.token
    const resetPasswordToken= crypto.createHash("sha256").update(token).digest("hex")
    const user =await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new ApiErrorHandler('Reset password time out!',401))
    }else{
        user.password=req.body.password
        await user.save()
        res.status(200).json({success:true,message:'Password Updated Successfuly'})
    }

}
)


const get_allUsersForAdmin=asyncHandler(async(req,res,next)=>{
    const users=await User.find()
    const userCount= await User.countDocuments()

    res.status(200).json({success:true,users,userCount})
})


const delete_user=asyncHandler(async(req,res,next)=>{
    const id = req.params.id
    await User.findByIdAndDelete(id)
    const users=await User.find()

    res.status(200).json({success:true, message:'User Deleted',users})
})


const update_user=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        return next(new ApiErrorHandler('No User Found',404))
    }
    user.role=req.body.role
    await user.save()
    const users=await User.find()

    res.status(200).json({message:'User Updated',success:true,users})
})
module.exports={
    register_user,
    login_user,
    logout_user,
    get_userDetails,
    update_userDetails,
    updated_password,
    forgotPassword,
    resetPassword,
    get_allUsersForAdmin,
    delete_user,
    update_user
}