const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error : ",error);
        process.exit(1);
    }
}

module.exports = connectDB;