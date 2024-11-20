import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    cartItems: []
}

export const addToCart = createAsyncThunk('/cart/addToCart', async ({userid, productid, quantity}) => {
    const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/cart/add-to-cart`, {userid, productid, quantity});

    return result.data;
})

export const fetchCartItems = createAsyncThunk('/cart/fetchCartItems', async (userid) => {
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/fetch-cart-items/${userid}`);
    return result.data
})

export const updateCartItemQuantity = createAsyncThunk('/cart/updateCartItemQuantity', async ({userid, productid, quantity}) => {
    const result = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart-item-quantity`, {userid, productid, quantity});
    return result.data
})

export const deleteCartItem = createAsyncThunk('/cart/deleteCartItem', async ({userid, productid}) => {
    const result = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/cart/delete-cart-item/${userid}/${productid}`);
    return result.data
})

const cartSlice = createSlice({
    name: "shopCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addToCart.pending, (state) => {
           state.isLoading = true
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false
            state.cartItems = action.payload.data
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false
            state.cartItems = []
        })
        .addCase(fetchCartItems.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchCartItems.fulfilled, (state, action) => {
            state.isLoading = false
            state.cartItems = action.payload.data
        })
         .addCase(fetchCartItems.rejected, (state, action) => {
            state.isLoading = false
            state.cartItems = []
        })
        .addCase(updateCartItemQuantity.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
            state.isLoading = false
            state.cartItems = action.payload.data
        })
        .addCase(updateCartItemQuantity.rejected, (state, action) => {
            state.isLoading = false
            state.cartItems = []
        })
        .addCase(deleteCartItem.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.isLoading = false
            state.cartItems = action.payload.data
        })
        .addCase(deleteCartItem.rejected, (state, action) => {
            state.isLoading = false
            state.cartItems = []
        })
    }
})


export default cartSlice.reducer