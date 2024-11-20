const Product = require("../../models/product.model");


const searchProducts = async (req, res) => {
    try {
      const {keyWord} = req.params;
      if(!keyWord || typeof keyWord !== 'string') {
         return res
         .status(404)
         .json({
            success: false,
            message: "KeyWord is Required and must be in string format!"
         })
      }

      const regEx = new RegExp(keyWord, 'i')

      const createSearchQuery = {
        $or : [
            {title: regEx},
            {category: regEx},
            {brand: regEx},
            {description: regEx}
        ]
      }

      const searchResults = await Product.find(createSearchQuery)

      return res
        .status(200)
        .json({
            success: true,
            message: "Products Fetched Successfully!",
            data: searchResults
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

module.exports = { searchProducts }