import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading: false,
    searchProductList: []
}

export const searchProductsByKeyWord = createAsyncThunk('/search/searchProductsByKeyWord', 
    async (keyWord) => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/search/${keyWord}`);
      return result?.data
    }
)

const searchProductSlice = createSlice({
    name: 'searchProduct',
    initialState,
    reducers: {
        resetSearchProductList: (state) => {
            state.searchProductList = []
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(searchProductsByKeyWord.pending, (state) => {
            state.isLoading = true
        })
        .addCase(searchProductsByKeyWord.fulfilled, (state, action) => {
            state.isLoading = false
            state.searchProductList = action.payload.data
        })
        .addCase(searchProductsByKeyWord.rejected, (state) => {
            state.isLoading = false
            state.searchProductList = []
        })
    }
})

export const { resetSearchProductList } = searchProductSlice.actions
export default searchProductSlice.reducer