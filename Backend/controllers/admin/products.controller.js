const {imageUploadUtil} = require("../../helpers/cloudinary");
const Product = require("../../models/product.model");
  


const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);

        return res
            .status(200)
            .json({
                success: true,
                result
            })
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error!",
            })
    }
}

const addProduct = async (req, res) => {
    try {

     const {image, title, description, category, brand, price, saleprice, totalstock} = req.body;

     if(!image || !title  || !category || !brand || !price) {
        return res
            .status(400)
            .json({
                success: false,
                message:'Please Provide All the Required Fields!'
            })
     }

     const newProduct = new Product({
        image,
        title,
        description,
        category,
        brand,
        price,
        saleprice,
        totalstock
     })

     await newProduct.save();

     return res
        .status(201)
        .json({
            success: true,
            message: "Product Added Successfully!",
            data: newProduct
        })

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error!",
            })
    }
}


const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if(!product) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Product Not Found!",
                })
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "Product Deleted Successfully!",
            })
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error!",
            })
    }
}


const editProduct = async (req, res) => {
    try {
      const {id} = req.params;
      let product = await Product.findById(id);
      if(!product) {
        return res
            .status(404)
            .json({
                success: false,
                message: "Product Not Found!",
            })
      }

      const {image, title, description, category, brand, price, saleprice, totalstock} = req.body;

      product.title = title || product.title;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.price = price === '' ? 0 : price;
      product.saleprice = saleprice === '' ? 0 : saleprice;
      product.totalstock = totalstock || product.totalstock;
      product.image = image || product.image;

      await product.save();

      return res
        .status(200)
        .json({
            success: true,
            message: "Product Updated Successfully!",
            data: product
        })

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error!",
            })
    }
}


const fetchAllProducts = async (req, res) => {
    try {
      const listOfProducts = await Product.find({});

      return res
        .status(200)
        .json({
            success: true,
            data: listOfProducts
        })

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error!",
            })
    }
}


module.exports = { handleImageUpload, addProduct, deleteProduct, editProduct, fetchAllProducts }