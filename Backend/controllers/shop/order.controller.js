const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const paypal = require('../../helpers/paypal');

const createOrder = async (req, res) => {
    try {
        const {
            userid, cartid, cartitems, addressinfo, orderstatus,
            paymentmethod, paymentstatus, totalamount,
            orderdate, orderupdatedate, paymentid, payerid
        } = req.body;

        const create_payment_json = {
            intent: "sale",
            payer:{
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
            },
            transactions: [
                {
                    item_list: {
                    items: cartitems.map(item => ({
                        name: item.title,
                        sku: item.productid,
                        price: item.price,
                        currency: "USD",
                        quantity: item.quantity
                    }))

                    },
                    amount:{
                    currency: "USD",
                    total: totalamount
                    },
                    description: "This is the payment description."
                }
            ]
        }

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
           if(error) {
                console.error(error);
                return res.
                status(500)
                .json({
                success: false,
                message: "Error While Creating PayPal Payment!"
                })
           } else {
                const newOrder = new Order({
                   userid, 
                   cartid,
                   cartitems, 
                   addressinfo, 
                   orderstatus,
                   paymentmethod, 
                   paymentstatus, 
                   totalamount,
                   orderdate, 
                   orderupdatedate, 
                   paymentid, 
                   payerid
                })

                if(!newOrder) {
                    return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Error While Creating Order!"
                    })
                }

                await newOrder.save();

                const approvalURL = paymentInfo.links.find(link => link.rel === "approval_url").href;
                
                return res
                .status(201)
                .json({
                    success: true,
                    message: "Order Placed!",
                    approvalURL,
                    orderid: newOrder._id
                })
           }
        })

    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}
const capturePayment = async (req, res) => {
    try {

       const {payerid, paymentid, orderid} = req.body
       const order = await Order.findById(orderid);
       if(!order) {
         return res
         .status(404)
         .json({
            success: false,
            message: "Order Not Found!"
         })
        }
 
        order.paymentstatus = "paid";
        order.orderstatus = "confirmed";
        order.paymentid = paymentid;
        order.payerid = payerid;

        for(let item of order.cartitems) {
            const product = await Product.findById(item.productid);
            if(!product) {
               return res
               .status(404)
               .json({
                  success: false,
                  message: `Not Enough Stock For ${product.title}`
               })
            }
            
            product.totalstock = product.totalstock - item.quantity;
            await product.save();
        }

        const getCartId = order.cartid;

        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        return res
        .status(200)
        .json({
            success: true,
            message: "Order Confirmed",
            data: order
        })
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

const getAllOrderByUser = async (req, res) => {
   try {
    const {userid} = req.params;
    const orders = await Order.find({userid});

    if(!orders.length) {
       return res
       .status(404)
       .json({
          success: false,
          message: "No Orders Found!"
       })
    }

    return res
    .status(200)
    .json({
       success: true,
       data: orders
    })
    
   } catch (error) {
       return res
       .status(500)
       .json({
          success: false,
          message: "Internal Server Error!"
       })
   }
} 

const getOrderDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const order = await Order.findById(id);
    
        if(!order) {
           return res
           .status(404)
           .json({
              success: false,
              message: "No Order Found!"
           })
        }
    
        return res
        .status(200)
        .json({
           success: true,
           data: order
        })
        
    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal Server Error!"
        })
    }     
}

module.exports = { createOrder,capturePayment,getAllOrderByUser,getOrderDetails }