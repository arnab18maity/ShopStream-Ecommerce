const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')

const addToCart = async(req,res) => {
    try {
      const {userid, productid, quantity} = req.body;

      if(!userid || !productid || !quantity) {
         return res
         .status(400)
         .json({
             success: false,
             message: "All fields are required!"
         })
      }

      const product = await Product.findById(productid);

      if(!product) {
        return res
         .status(400)
         .json({
            success: false,
            message: "Product not found!"
         })
      }

      let cart = await Cart.findOne({userid});

      if(!cart) {
        cart = new Cart({userid, items: []});
      }

      const findCurrentProductIndex = cart.items.findIndex(item => item.productid.toString() === productid);

      if(findCurrentProductIndex === -1) {
        cart.items.push({productid, quantity});
      }
      else{
        cart.items[findCurrentProductIndex].quantity += quantity;
      }

      await cart.save();

      return res
      .status(200)
      .json({
          success: true,
          message: "Product Added to Cart Successfully!",
          data: cart
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


const fetchCartItems = async(req,res) => {
    try {
      const {userid} = req.params;

      if(!userid) {
         return res
         .status(400)
         .json({
             success: false,
             message: "Userid is required!"
         })
      }

      const cart = await Cart.findOne({userid}).populate({
        path: 'items.productid',
        select: 'image title price saleprice'
      });

      if(!cart) {
        return res
         .status(400)
         .json({
             success: false,
             message: "Cart Not Found!"
         })
      }

      const validItems = cart.items.filter(productItem => productItem.productid);

      if(validItems.length < cart.items.length) {
        cart.items = validItems;
        await cart.save();
      }

      const populateCartItems = validItems.map(item => ({
         productid: item.productid._id,
         image: item.productid.image,
         title: item.productid.title,
         price: item.productid.price,
         saleprice: item.productid.saleprice,
         quantity: item.quantity
      }))

      return res
      .status(200)
      .json({
          success: true,
          message: "Cart Items Fetched Successfully!",
          data: {
             ...cart._doc,
             items: populateCartItems
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


const updateCartItemQuantity = async(req,res) => {
    try {
      const {userid, productid, quantity} = req.body;
      if(!userid || !productid || quantity <= 0) {
        return res
        .status(400)
        .json({
            success: false,
            message: "All fields are required!"
        })
      }

      const cart = await Cart.findOne({userid});

      if(!cart) {
        return res
        .status(400)
        .json({
            success: false,
            message: "Cart not found!"
        })
      }

      const findCurrentProductIndex = cart.items.findIndex(item => item.productid.toString() === productid);

      if(findCurrentProductIndex === -1) {
        return res
        .status(400)
        .json({
            success: false,
            message: "Product not found in cart!"
        })
      }
      
      cart.items[findCurrentProductIndex].quantity = quantity;
     
      await cart.save();

      await cart.populate({
        path: 'items.productid',
        select: 'image title price saleprice'
      })

      const populateCartItems = cart.items.map(item => ({
        productid: item.productid ? item.productid._id : null,
        image: item.productid ? item.productid.image : null,
        title: item.productid ? item.productid.title : 'Product Not Found',
        price: item.productid ? item.productid.price : null,
        saleprice: item.productid ? item.productid.saleprice : null,
        quantity: item.quantity
     }))

     return res
     .status(200)
     .json({
         success: true,
         message: "Cart Item Updated Successfully!",
         data: {
            ...cart._doc,
            items: populateCartItems
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


const deleteCartItem = async(req,res) => {
    try {
      const {userid, productid} = req.params;

      if(!userid || !productid) {
        return res
        .status(400)
        .json({
            success: false,
            message: "All fields are required!"
        })
      }

      const cart  = await Cart.findOne({userid}).populate({
        path: 'items.productid',
        select: 'image title price saleprice'
      });

      if(!cart) {
        return res
        .status(400)
        .json({
            success: false,
            message: "Cart not found!"
        })
      }

      cart.items = cart.items.filter(item => item.productid._id.toString() !== productid);

      await cart.save();

      await cart.populate({
        path: 'items.productid',
        select: 'image title price saleprice'
      });

      const populateCartItems = cart.items.map(item => ({
        productid: item.productid ? item.productid._id : null,
        image: item.productid ? item.productid.image : null,
        title: item.productid ? item.productid.title : 'Product Not Found',
        price: item.productid ? item.productid.price : null,
        saleprice: item.productid ? item.productid.saleprice : null,
        quantity: item.quantity
     }))

     return res
     .status(200)
     .json({
         success: true,
         message: "Cart Item Deleted Successfully!",
         data: {
            ...cart._doc,
            items: populateCartItems
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

module.exports = { addToCart,fetchCartItems,updateCartItemQuantity,deleteCartItem }