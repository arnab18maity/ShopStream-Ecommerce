const {addAddress, editAddress, fetchAllAddress, deleteAddress} = require('../../controllers/shop/address.controller');
const express = require('express');
const router = express.Router();

router.post('/add-address', addAddress)
router.put('/edit-address/:userid/:addressid', editAddress)
router.get('/fetch-all-addresses/:userid', fetchAllAddress)
router.delete('/delete-address/:userid/:addressid', deleteAddress)

module.exports = router