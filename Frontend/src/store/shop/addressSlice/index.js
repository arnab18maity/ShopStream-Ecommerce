import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    addressList: []
}

export const addAddress = createAsyncThunk('/address/addAddress', async (formData) => {
    const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/address/add-address`, formData);

    return result.data;
})

export const fetchAllAddress = createAsyncThunk('/address/fetchAllAddress', async (userid) => {
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/address/fetch-all-addresses/${userid}`);

    return result.data;
})

export const editAddress = createAsyncThunk('/address/editAddress', async ({formData, userid, addressid}) => {
    const result = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/address/edit-address/${userid}/${addressid}`, formData);

    return result.data;
})

export const deleteAddress = createAsyncThunk('/address/deleteAddress', async ({userid, addressid}) => {
    const result = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/address/delete-address/${userid}/${addressid}`);

    return result.data;
})

const addressSlice = createSlice({
    name: "shopAddress",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addAddress.pending, (state) => {
           state.isLoading = true
        })
        .addCase(addAddress.fulfilled, (state, action) => {
            state.isLoading = false
        })
        .addCase(addAddress.rejected, (state) => {
            state.isLoading = false
            state.addressList = []
        })
        .addCase(fetchAllAddress.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchAllAddress.fulfilled, (state, action) => {
            state.isLoading = false
            state.addressList = action.payload.data
        })
         .addCase(fetchAllAddress.rejected, (state) => {
            state.isLoading = false
            state.addressList = []
        })
    }
})


export default addressSlice.reducer