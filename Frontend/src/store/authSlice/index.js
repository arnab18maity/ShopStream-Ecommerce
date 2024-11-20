import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
   isAuthenticated: false,
   isLoading: true,
   user: null 
}

export const registerUser = createAsyncThunk('/auth/register',
    async (formData,{ rejectWithValue }) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,formData,{
          withCredentials: true
        })
        return response.data

      } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue({ message: 'Something went wrong!' });
        }
      }
    }
)

export const loginUser = createAsyncThunk('/auth/login',
    async (formData,{ rejectWithValue }) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,formData,{
          withCredentials: true
        })

        return response.data
      } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue({ message: 'Something went wrong!' });
        }
      }
    }
)

export const logoutUser = createAsyncThunk('/auth/logout',
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{},
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
      } else {
          return rejectWithValue({ message: 'Something went wrong!' });
      }
    }
  }
)

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async (_,{ rejectWithValue }) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
          {
            withCredentials: true,
            headers: {
              'Cache-Control': 'no-store,no-cache,must-revalidate,proxy-revalidate',
            }
          }
        )

        return response.data
      } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue({ message: 'Something went wrong!' });
        }
      }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
           
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false
            state.isAuthenticated = false
            state.user = null
        })
        .addCase(registerUser.rejected,(state) => {
            state.isLoading = false
            state.isAuthenticated = false
            state.user = null
        })
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true
        })
        .addCase(loginUser.fulfilled,(state,action) => {
            state.isLoading = false
            state.isAuthenticated = action.payload.success
            state.user = action.payload.success ? action.payload.user : null
        })
        .addCase(loginUser.rejected, (state) => {
            state.isLoading = false
            state.isAuthenticated = false
            state.user = null
        })
        .addCase(checkAuth.pending, (state) => {
            state.isLoading = true
        })
        .addCase(checkAuth.fulfilled,(state,action) => {
            state.isLoading = false
            state.isAuthenticated = action.payload.success
            state.user = action.payload.success ? action.payload.user : null
        })
        .addCase(checkAuth.rejected, (state) => {
            state.isLoading = false
            state.isAuthenticated = false
            state.user = null
        })
        .addCase(logoutUser.fulfilled,(state,action) => {
          state.isLoading = false
          state.isAuthenticated = false
          state.user = null
      })
    }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer