const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productid: String,
    userid: String,
    username: String,
    reviewMessage: String,
    reviewvalue: Number
},{timestamps: true});

const ProductReview = mongoose.model('ProductReview', reviewSchema); 
module.exports = ProductReview