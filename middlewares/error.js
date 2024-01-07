const ApiErrorHandler =require ("../utils/apiError")
const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || 'Something went wrong'
    err.statusCode=err.statusCode || 500

    if(err.code===11000){
        err.message='Email already exits'
        err.statusCode=401
    }
    if(err.name==='CastError'){
        err= new ApiErrorHandler(` Resource not fount due to Inavalid : ${err.path}`, 404)
      
    }
    console.log(err)

    

    res.status(err.statusCode).json({
        message: err.message, 
        success:false
    })
}



module.exports = errorMiddleware