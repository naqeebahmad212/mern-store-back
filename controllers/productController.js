const asyncHandler = require("../utils/asyncHandler");
const cloudinary = require("cloudinary");
const Product = require("../models/product");
const Order=require('../models/order')
const ApiFeatures = require("../utils/ApiFeatures");
const ApiErrorHandler = require("../utils/apiError");

const createNewProduct = asyncHandler(async (req, res, next) => {
  let images = [];
  if (typeof req.body.files === "string") {
    images.push(req.body.files);
  } else {
    images = req.body.files;
  }

  const imagesLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "product",
    });
    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  (req.body.user = req.user._id), (req.body.images = imagesLink);

  const product = await Product.create(req.body);
  res.status(200).json({ success: true, product });
});

const get_allProducts = asyncHandler(async (req, res, next) => {
  const perPage = 9;
  const apiFeature = await new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(perPage);
  const products = await apiFeature.query;

  res.status(200).json({ success: true, products, perPage });
});

const get_productDetails = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ApiErrorHandler("No Product Found", 404));
  }
  res.status(200).json({ success: true, product });
});

// submit and update review

const createAndUpdateReview = asyncHandler(async (req, res, next) => {
  const { id, comment, rating } = req.body;
  const review = {
    user: req.user._id,
    profile: req.user.image.url,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(id);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
        rev.profile=req.user.image.url
      }
    });
  } else {
    product.reviews.push(review);
    product.totalReview = product.reviews.length;
  }

  const totalRatingCount= product.reviews.reduce((acc,item)=> acc + item.rating, 0 )
  product.ratings=totalRatingCount / product.reviews.length

  await product.save()

  res.status(200).json({success:true,product})
});



const get_allAdminProducts=asyncHandler(async(req,res,next)=>{


  const products=await Product.find().populate('user', 'name')
  const totalCount = await Product.countDocuments();
  res.status(200).json({success:true,products,totalCount})
})

const get_allAdminOrders=asyncHandler(async(req,res,next)=>{


  const orders=await Order.find()
  const orderCount= await  Order.countDocuments()
  res.status(200).json({success:true,orders,orderCount})
})

const delete_product=asyncHandler(async(req,res,next)=>{
  const id=req.params.id
  await Product.findByIdAndDelete(id)
  res.status(200).json({message:'Product was deleted',success:true})
})


const update_product=asyncHandler(async(req,res,next)=>{
  const product= await Product.findById(req.params.id)
  if(req.body.files !== undefined && req.body.files !== '' ){
    let images=[]
    
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id)  
    }

    if (typeof req.body.files === "string") {
      images.push(req.body.files);
    } else {
      images = req.body.files;
    }

    let imagesLinks=[]
    for (let i = 0; i < images.length; i++) {
      const result= await cloudinary.v2.uploader.upload(images[i],{
        folder:'product'
      }) 
      imagesLinks.push({
        public_id: result.public_id,
        url:result.secure_url
      }) 
    }    

    req.body.images=imagesLinks
  }
  await Product.findByIdAndUpdate(req.params.id,req.body)

  const updatedProduct=await Product.findById(req.params.id)
  res.status(200).json({success:true, message:'Product was Updated',updatedProduct})

})




module.exports = {
  createNewProduct,
  get_allProducts,
  get_productDetails,
  createAndUpdateReview,
  get_allAdminProducts,
  get_allAdminOrders,
  delete_product,
  update_product,
 
};
