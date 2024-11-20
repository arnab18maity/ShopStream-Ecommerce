import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import adminProductsSlice from "./admin/productSlice"
import adminOrderSlice from "./admin/orderSlice"

import shopProductSlice from "./shop/productSlice"
import cartProductSlice from "./shop/cartSlice"
import shopAddressSlice from "./shop/addressSlice"
import ShopOrderSlice from './shop/orderSlice/index';
import shopSearchSlice from "./shop/searchSlice"
import shopReviewSlice from "./shop/reviewSlice"




const store = configureStore({
    reducer: {
        auth : authReducer,
        adminProducts : adminProductsSlice,
        adminOrders : adminOrderSlice,
        shopProducts: shopProductSlice,
        cartProducts: cartProductSlice,
        shopAddress: shopAddressSlice,
        shopOrder: ShopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice
    }
})

export default store;