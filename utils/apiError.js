class ApiErrorHandler extends Error{
    constructor(message='Something went wrong',statusCode=500){
        super(message)
        this.statusCode=statusCode
        this.message=message
        // this.success=false
    }
}



module.exports= ApiErrorHandler