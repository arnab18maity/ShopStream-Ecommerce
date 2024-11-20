import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
   isLoading: false,
   reviewList: [],
}

export const addProductReview = createAsyncThunk('/review/addProductReview', 
 async (data) => {
    const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/add-review`, data);
    return result?.data
})

export const fetchAllReview = createAsyncThunk('/review/fetchAllReview', 
    async (productId) => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/get-review/${productId}`);
      return result?.data
    }
)

const ShopReviewSlice = createSlice({
    name: 'shopReview',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(addProductReview.pending, (state) => {
            state.isLoading = true
        })
        .addCase(addProductReview.fulfilled, (state) => {
            state.isLoading = false
        })
        .addCase(addProductReview.rejected, (state) => {
            state.isLoading = false
        })
        .addCase(fetchAllReview.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchAllReview.fulfilled, (state, action) => {
            state.isLoading = false
            state.reviewList = action.payload.data
        })
        .addCase(fetchAllReview.rejected, (state) => {
            state.isLoading = false
            state.reviewList = [];
        })
    }
})


export default ShopReviewSlice.reducer; 