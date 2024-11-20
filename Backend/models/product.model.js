const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
        type:String,
        required: true
    },
    title: {
        type:String,
        required: true
    },
    description: String,
    category: {
        type:String,
        required: true
    },
    brand: {
        type:String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    saleprice: {
        type:Number,
        default:0
    },
    totalstock: {
        type:Number,
        default:0
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product