class ApiFeatures {
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr
    }


    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i',
            }
        } : {}

        this.query=this.query.find({...keyword})
        return this
    }

    filter(){
        const queryStrCopy={...this.queryStr}
    
        // removinf some fieds fro category
        const toBeRemoved=['page','limit','keyword']
        toBeRemoved.forEach((item)=> delete queryStrCopy[item])

        // filter for price and ratings
        let queryStr=JSON.stringify(queryStrCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=> `$${key}`);
        

        this.query=this.query.find(JSON.parse(queryStr))
        return this

    }

    pagination(perPage){
        const currentPage= Number(this.queryStr.page) || 1

        const skip=perPage * (currentPage- 1)
        this.query.limit(perPage).skip(skip)

        return this;
    }
}

module.exports=ApiFeatures