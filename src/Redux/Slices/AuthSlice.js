import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Config";

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const responce = await axios.get(`${API_BASE_URL}/user/getUser`, {
                withCredentials: true,
            });
            return responce.data.data;
        } catch (error) {
            return rejectWithValue(
                error.responce?.data?.message || "Failed to fetch user"
            );
        }
    }
)

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (FormData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/user/register`,
                FormData, 
                {withCredentials:true, headers:{"Content-Type":"multipart/form-data"},
            })

            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error.res?.data?.message || "Signup failed"
            );
        }
    }
)

export const loginUser = createAsyncThunk("/auth/loginUser",
    async (credentials, {rejectWithValue})=>{
        try {
            const res = await axios.post(`${API_BASE_URL}/user/login`,
                credentials,
                {withCredentials:true}
            );
            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error?.res?.data?.message || "Login Failed"
            )
        }
    })

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        showLogin: {
            login: true,
            signup: false
        },
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.showLogin = { login: true, signup: false };
        },
        setShowLogin: (state, action) => {
            state.showLogin = action.payload;
        },
        clearError: (state)=>{
            state.error = null;
        },
        setLoading: (state)=>{
            state.loading = action.payload;
        },
        setError: (state)=>{
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
                state.showLogin = { login: false, signup: false }
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.showLogin = { login: true, signup: false }
            })
            .addCase(signupUser.pending,(state)=>{
                state.loading = true;
            })
            .addCase(signupUser.fulfilled,(state,action)=>{
                state.user = action.payload;
                state.loading = false;
                state.error = null;
                state.showLogin={login:false, signup:false}
            })
            .addCase(signupUser.rejected, (state,action)=>{
                state.error = action.payload;
                state.loading= false;
            })
            .addCase(loginUser.pending, (state)=>{
                state.loading = true;
            })
            .addCase(loginUser.fulfilled,(state, action)=>{
                state.user = action.payload;
                state.loading = false;
                state.error = null;
                state.showLogin={login:false, signup:false};
            })
            .addCase(loginUser.rejected, (state,action)=>{
                state.error = action.payload;
                state.loading= false;
            })
    }
})

export const { setShowLogin, setUser, logout, clearError, setError,setLoading,set } = authSlice.actions;
export default authSlice.reducer;