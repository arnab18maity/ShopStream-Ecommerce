const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        required: true
    },
    landmark:{
       type: String
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address