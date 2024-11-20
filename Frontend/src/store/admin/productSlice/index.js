import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    productList: [],
    isLoading: false
}

export const addNewProduct = createAsyncThunk('/products/addNewProduct', async (formData, { rejectWithValue }) => {
    try {
        const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/add-product`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return result?.data

    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue({ message: 'Something went wrong!' });
        }
    }
})

export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts', async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/fetch-products`);

    return result?.data
})

export const editProduct = createAsyncThunk('/products/editProduct', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const result = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/edit-product/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return result?.data
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue({ message: 'Something went wrong!' });
        }
    }
})

export const deleteProduct = createAsyncThunk('/products/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        const result = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete-product/${id}`);

        return result?.data
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue({ message: 'Something went wrong!' });
        }
    }
})


const AdminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.productList = action.payload.data

            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false
                state.productList = []
            })
    }
})

export default AdminProductsSlice.reducer