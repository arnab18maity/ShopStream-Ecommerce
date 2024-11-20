const { addProductReview, getProductReview } = require("../../controllers/shop/review.controller");

const express = require('express');
const router = express.Router();

router.post('/add-review', addProductReview)
router.get('/get-review/:productid', getProductReview) 

module.exports = router