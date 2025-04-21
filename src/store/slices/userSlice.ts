import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import VisitorService from '../../services/visitorService';
import { Visitor } from '../../types';

// 管理员类型定义
interface AdminUser {
  id: string;
  username: string;
  avatar: string;
  role: 'admin';
  githubId: string;  // GitHub 用户 ID
}

interface UserState {
  currentUser: AdminUser | null;  // 管理员信息
  visitorInfo: Visitor | null;    // 游客信息
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  visitorInfo: null,
  loading: false,
  error: null,
};

// 异步 Action: 获取游客身份
export const getVisitorInfo = createAsyncThunk(
  'user/getVisitorInfo',
  async () => {
    const visitor = await VisitorService.getVisitorIdentity();
    return visitor;
  }
);

// 异步 Action: 设置管理员身份（从 Auth0 获取的 GitHub 用户信息）
export const setAdminUser = createAsyncThunk(
  'user/setAdminUser',
  async (auth0User: any) => {
    // 验证是否是允许的 GitHub 用户
    if (auth0User.nickname !== 'Anakin2555') {
      throw new Error('Unauthorized user');
    }

    const adminUser: AdminUser = {
      id: auth0User.sub,
      username: auth0User.nickname,
      avatar: auth0User.picture,
      role: 'admin',
      githubId: auth0User.sub.split('|')[1] // 从 auth0 的 sub 中提取 GitHub ID
    };

    return adminUser;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearAdmin: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 处理游客身份获取
      .addCase(getVisitorInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVisitorInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.visitorInfo = action.payload;
      })
      .addCase(getVisitorInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get visitor info';
      })
      // 处理管理员身份设置
      .addCase(setAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        // 保持游客信息，因为可能还需要用到游客的浏览记录等
        // state.visitorInfo = null; 
      })
      .addCase(setAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unauthorized';
        state.currentUser = null;
      });
  },
});

// Rename clearAdmin to logoutAdmin for consistency
export const { clearAdmin: logoutAdmin, setError } = userSlice.actions;
export default userSlice.reducer; 