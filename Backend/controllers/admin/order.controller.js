const Order = require("../../models/order.model");


const getAllOrdersOfAllUser = async(req,res) => {
    try {
        const orders = await Order.find({});
    
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

const getOrderDetailsForAdmin = async (req, res) => {
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

const updateOrderStatus = async(req,res) => {
    try {
        const {id} = req.params;
        const {orderStatus} = req.body;
        const order = await Order.findById(id);
    
        if(!order) {
           return res
           .status(404)
           .json({
              success: false,
              message: "No Order Found!"
           })
        }

        await Order.findByIdAndUpdate(id, {orderstatus: orderStatus});
    
        return res
        .status(200)
        .json({
           success: true,
           message: "Order Status Updated Successfully!",
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

module.exports = { getAllOrdersOfAllUser, getOrderDetailsForAdmin, updateOrderStatus } 