const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const productSchema=new Schema({
    name:{
        type:String,
        required:[true,'Enter product name']
    },
    price:{
        type:Number,
        required:[true,'Enter price for product']
    },
    description:{
        type:String,
        required:[true,'Provide product description']
    },
    ratings:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        required:[true,'Provide Stock'],
        default:1
    },
    category:{
        type:String,
        required:[true,'please enter category']
    },
    images:[
        {
            url:{
                type:String,
                required:[true,'Product images missing']
            },
            public_id:{
                type:String,
                required:true
            }
        }
    ],
    totalReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                required:[true,'Enter product name']
            },
            rating:{
                type:Number,
                default:0
            },
            comment:{
                type:String
            },
            profile:{
                type:String,
                required:true
            },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


const Product=mongoose.model('Product',productSchema)
module.exports=Product