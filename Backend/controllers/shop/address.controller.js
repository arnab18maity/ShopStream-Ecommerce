const User = require("../../models/user.model");
const Address = require("../../models/address.model");

const addAddress = async (req, res) => {
  try {
    const { name, mobile, address, city, state, pincode, landmark, userid } = req.body;

    if(!name || !mobile || !address || !city || !state || !pincode || !userid){
        return res
        .status(400)
        .json({
            success: false,
            message: "Please Fill All the Required Fields!"
        })
    }

    const newAddress =  new Address({
        name,
        mobile,
        address,
        city,
        state,
        pincode,
        landmark,
        userid
    });

    await newAddress.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Address Added Successfully!",
        data: newAddress
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
};

const editAddress = async (req, res) => {
  try {
    const formData = req.body;
    const { userid, addressid } = req.params;

    if(!userid || !addressid) {
        return res
        .status(404)    
        .json({
            success: false,
            message: "User Id and Address Id is Required!" 
        })
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { 
        _id: addressid, 
        userid
      }, 
      formData, 
      { new: true}
    );

    if(!updatedAddress) {
        return res
        .status(404)
        .json({
            success: false,
            message: "Address Not Found!"
        })
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Address Updated Successfully!",
        data: updatedAddress
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
};

const fetchAllAddress = async (req, res) => {
    try {
      const {userid} = req.params;

      if(!userid) {
        return res
        .status(404)
        .json({
            success: false,
            message: "User Id is Required!"
        })
      }

      const addresses = await Address.find({userid});

      return res
      .status(200)
      .json({
          success: true,
          message: "Addresses Fetched Successfully!",
          data: addresses
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
};

const deleteAddress = async (req, res) => {
    try {
      const {userid, addressid} = req.params;

      if(!userid || !addressid) {
        return res
        .status(404)    
        .json({
            success: false,
            message: "User Id and Address Id is Required!" 
        })
      }

      const address = await Address.findOneAndDelete({_id: addressid, userid});

      if(!address) {
        return res
        .status(404)
        .json({
            success: false,
            message: "Address Not Found!"
        })
      }

      return res
      .status(200)
      .json({
          success: true,
          message: "Addresses Deleted Successfully!",
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
};

module.exports = { addAddress, editAddress, deleteAddress, fetchAllAddress };
