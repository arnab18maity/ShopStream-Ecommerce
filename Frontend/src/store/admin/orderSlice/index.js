import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    orderDetails: null,
    orderList: []
}

export const getAllOrdersForAdmin = createAsyncThunk('/order/getAllOrdersForAdmin', 
    async () => { 
       const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/get-orders`);
       return result?.data
    }
)

export const getOrderDetailsForAdmin = createAsyncThunk('/order/getOrderDetailsForAdmin', 
    async (id) => { 
       const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/get-order-details/${id}`);
       return result?.data
    }
)

export const updateOrderStatus = createAsyncThunk('/order/updateOrderStatus',
    async ({id, orderStatus}) => {
       const result = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/update-order-status/${id}`, {orderStatus}); 
       return result?.data
    }
)

const adminOrderSlice = createSlice({
    name: 'adminOrder',
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(getAllOrdersForAdmin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
            state.isLoading = false
            state.orderList = action.payload.data
        })
        .addCase(getAllOrdersForAdmin.rejected, (state) => {
            state.isLoading = false
            state.orderList = []
        })
        .addCase(getOrderDetailsForAdmin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
            state.isLoading = false
            state.orderDetails = action.payload.data
        })
        .addCase(getOrderDetailsForAdmin.rejected, (state) => {
            state.isLoading = false
            state.orderDetails = null
        })
    }
})

export const { resetOrderDetails } = adminOrderSlice.actions
export default adminOrderSlice.reducer