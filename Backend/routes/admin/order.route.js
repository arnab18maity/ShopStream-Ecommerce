const {getAllOrdersOfAllUser, getOrderDetailsForAdmin, updateOrderStatus} = require("../../controllers/admin/order.controller")
const express = require('express');
const router = express.Router();

router.get('/get-orders', getAllOrdersOfAllUser);
router.get('/get-order-details/:id', getOrderDetailsForAdmin);
router.put('/update-order-status/:id', updateOrderStatus)

module.exports = router