const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv').config('./.env');

const authRouter = require('./routes/auth/auth.route');
const adminProductsRouter = require('./routes/admin/products.route');
const adminOrderRouter = require('./routes/admin/order.route');
const shopProductsRouter = require('./routes/shop/product.route');
const shopCartRouter = require('./routes/shop/cart.route');
const shopAddressRouter = require('./routes/shop/address.route');
const shopOrderRouter = require('./routes/shop/order.route');
const shopSearchRouter = require('./routes/shop/search.route');
const shopReviewRouter = require('./routes/shop/review.route');

const connectDB = require('./db/dbConnect.js');



connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires','Pragma'],
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);

 
app.use('/api/shop/products', shopProductsRouter)
app.use('/api/shop/cart', shopCartRouter)
app.use('/api/shop/address',shopAddressRouter)
app.use('/api/shop/order',shopOrderRouter)
app.use('/api/shop/search',shopSearchRouter)
app.use('/api/shop/review',shopReviewRouter)

app.listen(port,() => {
    console.log(`Server is running ✅ on http://localhost:${port}`);
})