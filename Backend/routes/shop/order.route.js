const { createOrder, capturePayment,getAllOrderByUser,getOrderDetails } = require("../../controllers/shop/order.controller")

const express = require('express');
const router = express.Router();

router.post('/create-order', createOrder)
router.post('/capture-payment', capturePayment)
router.get('/get-order-by-user/:userid', getAllOrderByUser)
router.get('/get-order-details/:id', getOrderDetails)

module.exports = router