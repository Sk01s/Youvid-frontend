import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, AuthState, ApiError } from "../types";
import { loginApi, logoutApi, verifyTokenApi } from "../api/auth.api";

// Thunk state type (so we can read token)
type ThunkState = { auth: AuthState };

// LOGIN
export const login = createAsyncThunk<
  { user: AuthUser; token: string },
  { email: string; password: string; username?: string },
  { rejectValue: ApiError }
>("auth/login", async (creds, { rejectWithValue }) => {
  try {
    return await loginApi(creds.email, creds.password, creds.username);
  } catch (err: any) {
    return rejectWithValue({
      status: err.status ?? 500,
      message: err.message ?? "Login failed",
    });
  }
});

// LOGOUT
export const logout = createAsyncThunk<
  void,
  void,
  { state: ThunkState; rejectValue: ApiError }
>("auth/logout", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue({ status: 401, message: "No token to log out" });
  }
  try {
    await logoutApi(token);
  } catch (err: any) {
    return rejectWithValue({
      status: err.status ?? 500,
      message: err.message ?? "Logout failed",
    });
  }
});

// VERIFY TOKEN
export const verifyToken = createAsyncThunk<
  // we only care that it succeeds — payload content is ignored
  void,
  void,
  { state: ThunkState; rejectValue: ApiError }
>("auth/verifyToken", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue({ status: 401, message: "No token provided" });
  }
  try {
    await verifyTokenApi(token);
  } catch (err: any) {
    return rejectWithValue({
      status: err.status ?? 401,
      message: err.message ?? "Token verification failed",
    });
  }
});

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  verifying: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem("authToken", action.payload.token);
    },
    clearError(state) {
      state.error = null;
    },
    initializeAuth(state) {
      const stored = localStorage.getItem("authToken");
      if (stored) state.token = stored;
    },
  },
  extraReducers: (b) =>
    b
      // login
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        localStorage.setItem("authToken", a.payload.token);
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? { status: 500, message: "Login failed" };
      })

      // logout
      .addCase(logout.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(logout.fulfilled, (s) => {
        s.loading = false;
        s.user = null;
        s.token = null;
        localStorage.removeItem("authToken");
      })
      .addCase(logout.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? { status: 500, message: "Logout failed" };
      })

      // verify
      .addCase(verifyToken.pending, (s) => {
        s.verifying = true;
        s.error = null;
      })
      .addCase(verifyToken.fulfilled, (s) => {
        // only clear the verifying flag — do NOT touch user or token
        s.verifying = false;
      })
      .addCase(verifyToken.rejected, (s, a) => {
        s.verifying = false;
        // on failure, we *do* clear user/token so they get redirected
        s.user = null;
        s.token = null;
        s.error = a.payload ?? {
          status: 401,
          message: "Token verification failed",
        };
        localStorage.removeItem("authToken");
      }),
});

export const { setCredentials, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;
export const selectAuthVerifying = (state: { auth: AuthState }) =>
  state.auth.verifying;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
