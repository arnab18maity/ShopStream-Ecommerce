const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userid: String,
    cartid: String,
    cartitems: [
        {
           productid: String,
           title: String,
           image: String,
           price: String,
           quantity: Number
        }
    ],
    addressinfo:{
       addressid: String,
       name: String,
       mobile: Number,
       address: String,
       city: String,
       state: String,
       pincode: Number,
       landmark: String
    },
    orderstatus : String,
    paymentmethod: String,
    paymentstatus: String,
    totalamount: String,
    orderdate: Date,
    orderupdatedate: Date,
    paymentid: String,
    payerid: String

}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order