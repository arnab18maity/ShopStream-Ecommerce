const { 
    addToCart,
    fetchCartItems,
    updateCartItemQuantity,
    deleteCartItem 
} = require("../../controllers/shop/cart.controller");
const express = require('express');
const router = express.Router();

router.post('/add-to-cart', addToCart)
router.get('/fetch-cart-items/:userid', fetchCartItems)
router.put('/update-cart-item-quantity', updateCartItemQuantity)
router.delete('/delete-cart-item/:userid/:productid', deleteCartItem)


module.exports = router;