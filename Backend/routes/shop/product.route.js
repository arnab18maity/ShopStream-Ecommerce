const { getFilteredProducts, getProductDetails } = require("../../controllers/shop/product.controller");
const express = require('express');
const router = express.Router();

router.get('/get', getFilteredProducts)
router.get('/getProductDetails/:id', getProductDetails)


module.exports = router;