import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, AuthState, ApiError } from "../types";

import { RootState } from "../store";
import { loginApi, logoutApi } from "../api/auth.api";

// login thunk
export const login = createAsyncThunk<
  { user: AuthUser; token: string }, // return type
  { email: string; password: string; username?: string },
  { rejectValue: ApiError }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await loginApi(
      credentials.email,
      credentials.password,
      credentials.username
    );
  } catch (err: any) {
    // err is our ApiError
    return rejectWithValue({
      status: err.status ?? 500,
      message: err.message ?? "Login failed",
    });
  }
});

// logout thunk
export const logout = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: ApiError }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
  } catch (err: any) {
    return rejectWithValue({
      status: err.status ?? 500,
      message: err.message ?? "Logout failed",
    });
  }
});
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        // action.payload is ApiError or undefined
        state.error = action.payload ?? {
          status: 500,
          message: "Login failed",
        };
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? {
          status: 500,
          message: "Logout failed",
        };
      });
  },
});

export const { setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuth = (state: RootState) => state.auth;
