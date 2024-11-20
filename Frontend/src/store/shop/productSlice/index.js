import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
   isLoading: false,
   productList: [],
   productDetails: null
}

export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllFilteredProducts', 
 async ({filterParams,sortParams}) => {
    const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams
    }); 

    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`);
    return result?.data
})

export const getProductDetails = createAsyncThunk('/products/getProductDetails', 
    async (productId) => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/getProductDetails/${productId}`);
      return result?.data
    }
)

const ShopProductSlice = createSlice({
    name: 'shopProducts',
    initialState,
    reducers:{
        setProductDetails: (state) => {
           state.productDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllFilteredProducts.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            state.isLoading = false
            state.productList = action.payload.data
        })
        .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
            state.isLoading = false
            state.productList = []
        })
        .addCase(getProductDetails.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(getProductDetails.fulfilled, (state, action) => {
            state.isLoading = false
            state.productDetails = action.payload.data
        })
        .addCase(getProductDetails.rejected, (state, action) => {
            state.isLoading = false
            state.productDetails = null;
        })
    }
})

export const { setProductDetails } = ShopProductSlice.actions;
export default ShopProductSlice.reducer; 