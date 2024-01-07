const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const crypto =require('crypto')
const Schema=mongoose.Schema;
const userSchema=new Schema({

    name:{
        type:String,
        required:[true,'Enter Your Name']
    },
    email:{
        type:String,
        required:[true,'Enter Email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Enter Password'],
        select:false
    },
    image:{
        url:{
            type:String,
            // default:''
        },
        public_id:{
            type:String,
            // default:''
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
},{timestamps:true})


userSchema.methods.comparePassword= async function(enteredPassword){
    return await  bcrypt.compare(enteredPassword,this.password)
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });

// userSchema.pre('save',async function(next){

// next()
// })


userSchema.methods.getResetPasswordToken=  function(){
    const resetToken=crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken= crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire=Date.now()+15* 60*1000;
    return resetToken
}

const User=mongoose.model('User',userSchema)
module.exports= User