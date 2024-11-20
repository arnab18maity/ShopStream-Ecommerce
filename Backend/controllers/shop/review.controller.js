const ProductReview = require("../../models/review.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const addProductReview = async(req,res) => {
    try {
      const {productid, userid, username, reviewMessage, reviewvalue} = req.body
      const order = await Order.findOne({userid: userid, orderstatus: "delivered", "cartitems.productid": productid});

      if(!order) {
        return res
        .status(403)
        .json({
            success : false,
            message: "You can only add review for delivered order!"
        })
      }

      const checkExistingReview = await ProductReview.findOne({productid: productid, userid: userid});

      if(checkExistingReview) {
        return res
        .status(403)
        .json({
            success : false,
            message: "You have already added review for this product!"
        })
      }

      const newReview = new ProductReview({
        productid, userid, username, reviewMessage, reviewvalue
      })

      await newReview.save()

      const reviews = await ProductReview.find({productid: productid})
      const totalReviewsLength = reviews.length;
      const averageReview = reviews.reduce((sum,reviewItem) => sum + reviewItem.reviewvalue, 0) / totalReviewsLength;

      await Product.findByIdAndUpdate(productid, {averageReview: averageReview}) //TODO: Update Schema

      return res
      .status(201)
      .json({
         success: true,
         message: "Review Added Successfully!",
         data: newReview
      })

        
    } catch (error) {
       console.error(error);
       return res
       .status(500)
       .json({
           success : false,
           message: "Internal Server Error!"
       }) 
    }
}

const getProductReview = async(req,res) => {
    try {
        const {productid} = req.params;
        const reviews = await ProductReview.find({productid: productid})
        return res
        .status(200)
        .json({
            success : true,
            message: "Review Fetched Successfully!",
            data: reviews
        })
        
    } catch (error) {
       console.error(error);
       return res
       .status(500)
       .json({
           success : false,
           message: "Internal Server Error!"
       })
        
    }
}

module.exports = { addProductReview, getProductReview };