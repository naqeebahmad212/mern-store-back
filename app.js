const express =require('express')
const app =express()
const path=require('path')
const cloudinary=require('cloudinary')
const {connectDB}=require('./config/db')
 const dotenv =require('dotenv')
 const cookieParser=require('cookie-parser')
 const cors=require('cors')
 const errorMiddleware=require('./middlewares/error')
 const userRoutes=require('./routes/UserRoutes')
 const productRoutes=require('./routes/productRoutes')
 const paymentRoutes=require('./routes/paymentRoutes')
 const orderRoutes=require('./routes/orderRoutes')
 dotenv.config({
    path:'./config/.env'
})



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

 process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log('shuntting down the server due to uncaugth')

    process.exit(1)

})

 




// cloudinary.co


app.use(express.json())
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(cookieParser())
app.use(cors({origin:`${req.protocol}:${req.get('host')}`,credentials:true}))
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`listening to port : ${process.env.PORT} `)
    })
})
.catch((err)=>{
    console.log(err)
})



app.use(userRoutes)
app.use(productRoutes)
app.use(paymentRoutes)
app.use(orderRoutes)

app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
})

app.use(errorMiddleware)
