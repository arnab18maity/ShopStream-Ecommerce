import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    approvalURL: null,
    isLoading: false,
    orderid: null,
    orderList: [],
    orderDetails: null
}

export const createOrder = createAsyncThunk('/order/createOrder', 
    async (orderData) => { 
       const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/create-order`, orderData);
       return result?.data
    }
)

export const capturePayment = createAsyncThunk('/order/capturePayment', 
    async ({payerid, paymentid, orderid}) => { 
       const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/capture-payment`,{payerid, paymentid, orderid});
       return result?.data
    }
)

export const getAllOrderByUser = createAsyncThunk('/order/getAllOrderByUser', 
    async (userid) => { 
       const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/get-order-by-user/${userid}`);
       return result?.data
    }
)

export const getOrderDetails = createAsyncThunk('/order/getOrderDetails', 
    async (id) => { 
       const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/get-order-details/${id}`);
       return result?.data
    }
)

const ShopOrderSlice = createSlice({
    name: 'shopOrder',
    initialState,
    reducers:{
       resetOrderDetails : (state) => {
           state.orderDetails = null
       }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createOrder.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.isLoading = false
            state.approvalURL = action.payload.approvalURL
            state.orderid = action.payload.orderid
            sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderid))
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false
            state.approvalURL = null
            state.orderid = null
        })
        .addCase(getAllOrderByUser.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(getAllOrderByUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.orderList = action.payload.data
        })
        .addCase(getAllOrderByUser.rejected, (state, action) => {
            state.isLoading = false
            state.orderList = []
        })

        .addCase(getOrderDetails.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(getOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false
            state.orderDetails = action.payload.data
        })
        .addCase(getOrderDetails.rejected, (state, action) => {
            state.isLoading = false
            state.orderDetails = null
        })
    }
})

export const { resetOrderDetails } = ShopOrderSlice.actions;

export default ShopOrderSlice.reducer; 