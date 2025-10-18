import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Config";

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const responce = await axios.get(`${API_BASE_URL}/user/getUser`, {
                withCredentials: true,
            });
            console.log("user found");
            return responce.data.data;
        } catch (error) {
            dispatch(reFreshToken());
            console.log("user not found calling refreshtoken");
            return rejectWithValue(
                error.responce?.data?.message || "Failed to fetch user"
            );
        }
    }
)

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/user/register`,
                formData,
                {
                    withCredentials: true, headers: { "Content-Type": "multipart/form-data" },
                })
            if (res.data.success) {
                dispatch(loginUser({ username: formData.username, email: formData.email, password: formData.password }));
            }
            console.log(res);
            return res.data.data;
        } catch (error) {
            console.log("Signup error", error)
            return rejectWithValue(
                error.res?.data?.message || "Signup failed"
            );
        }
    }
)

export const loginUser = createAsyncThunk("/auth/loginUser",
    async (FormData, { rejectWithValue, dispatch }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/user/login`,
                FormData,
                { withCredentials: true }
            );
            console.log(res);
            return res.data.data;
        } catch (error) {
            console.log("login error", error);
            return rejectWithValue(
                error?.res?.data?.message || "Login Failed"
            )
        }
    })

    export const reFreshToken = createAsyncThunk("/auth/reFreshToken",
        async (_, { rejectWithValue, dispatch })=>{
            try {
                const res = await axios.post(`${API_BASE_URL}/user/refresh-token`,{},
                    {withCredentials:true}
                );
                console.log("new tokens received, calling fetchuser");
                await dispatch(fetchUser());
            } catch (error) {
                dispatch(setShowLogin({login:true, signup:false}));
                console.log("refresh token error", error);
                return rejectWithValue(
                error?.res?.data?.message || "refresh token Failed"
            )
            }
        }
    )

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        status: false,
        showLogin: {
            login: false,
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
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state) => {
            state.loading = action.payload;
        },
        setError: (state) => {
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
                console.log(state.user);
                state.loading = false;
                state.error = null;
                state.showLogin = { login: false, signup: false }
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(reFreshToken.pending,(state)=>{
                state.loading = true;
            })
            .addCase(reFreshToken.fulfilled, ( )=>{
                console.log("new tokens received");
            })
            .addCase(reFreshToken.rejected, (state)=>{
                state.showLogin = { login: true, signup: false}
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = true;
                state.loading = false;
                state.error = null;
                state.showLogin = { login: false, signup: false }
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.loading = false;
                state.status = true;
                state.error = null;
                state.showLogin = { login: false, signup: false };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    }
})

export const { setShowLogin, setUser, logout, clearError, setError, setLoading, set } = authSlice.actions;
export default authSlice.reducer;