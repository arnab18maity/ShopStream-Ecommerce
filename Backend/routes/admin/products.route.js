const express = require('express');
const { handleImageUpload, addProduct, deleteProduct, editProduct, fetchAllProducts } = require('../../controllers/admin/products.controller');
const {upload} = require('../../helpers/cloudinary')
const router = express.Router();

router.post('/upload-image', upload.single('my_file'), handleImageUpload);
router.post('/add-product',addProduct)
router.delete('/delete-product/:id',deleteProduct)
router.put('/edit-product/:id',editProduct)
router.get('/fetch-products',fetchAllProducts)

module.exports = router

