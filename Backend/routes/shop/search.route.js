const { searchProducts } = require("../../controllers/shop/search.controller");
const express = require('express')
const router = express.Router()

router.get('/:keyWord', searchProducts)

module.exports = router