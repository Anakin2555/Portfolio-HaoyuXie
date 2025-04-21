import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService, { AdminUser } from '../../services/authService';
import VisitorService from '../../services/visitorService';
import { Visitor } from '../../types';

interface UserState {
  currentUser: AdminUser | null;
  visitorInfo: Visitor | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: AuthService.getUser(),
  visitorInfo: null,
  loading: false,
  error: null,
};

// Async thunks
export const loginAdmin = createAsyncThunk(
  'user/loginAdmin',
  async ({ username, password }: { username: string; password: string }) => {
    const user = await AuthService.login(username, password);
    return user;
  }
);

export const logoutAdmin = createAsyncThunk(
  'user/logoutAdmin',
  async () => {
    AuthService.logout();
    const visitor = await VisitorService.getVisitorIdentity();
    return visitor;
  }
);

export const getVisitorInfo = createAsyncThunk(
  'user/getVisitorInfo',
  async () => {
    const visitor = await VisitorService.getVisitorIdentity();
    return visitor;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.visitorInfo = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Logout cases
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.currentUser = null;
        state.visitorInfo = action.payload;
      })
      // Get visitor info cases
      .addCase(getVisitorInfo.fulfilled, (state, action) => {
        state.visitorInfo = action.payload;
      });
  },
});

export default userSlice.reducer; 