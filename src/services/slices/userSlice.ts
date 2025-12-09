import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';
import type { RootState } from '../store';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk<
  TUser,
  { email: string; name: string; password: string },
  { rejectValue: string }
>('user/register', async (data, thunkAPI) => {
  try {
    const res: unknown = await registerUserApi(data);

    const typed = res as {
      accessToken: string;
      refreshToken: string;
      user: TUser;
    };

    setCookie('accessToken', typed.accessToken);
    localStorage.setItem('refreshToken', typed.refreshToken);

    return typed.user;
  } catch (err: unknown) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message || 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('user/login', async (data, thunkAPI) => {
  try {
    const res: unknown = await loginUserApi(data);

    const typed = res as {
      accessToken: string;
      refreshToken: string;
      user: TUser;
    };

    setCookie('accessToken', typed.accessToken);
    localStorage.setItem('refreshToken', typed.refreshToken);

    return typed.user;
  } catch (err: unknown) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message || 'Ошибка авторизации');
  }
});

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, thunkAPI) => {
    try {
      const res = await getUserApi();
      return res.user as TUser;
    } catch (err: unknown) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(
        error.message || 'Не удалось получить данные пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<{ email: string; name: string; password: string }>,
  { rejectValue: string }
>('user/updateUser', async (data, thunkAPI) => {
  try {
    const res = await updateUserApi(data);
    return res.user as TUser;
  } catch (err: unknown) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(
      error.message || 'Не удалось обновить данные пользователя'
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      setCookie('accessToken', '');
      localStorage.removeItem('refreshToken');
    } catch (err: unknown) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка выхода из аккаунта'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error?.message || 'Ошибка регистрации';
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error?.message || 'Ошибка авторизации';
      });

    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Ошибка получения данных пользователя';
        state.isAuthChecked = true;
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Ошибка обновления данных пользователя';
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Ошибка выхода из аккаунта';
      });
  }
});

export const { setAuthChecked } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserName = (state: RootState) => state.user.user?.name;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.user);
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserLoading = (state: RootState) => state.user.isLoading;

export default userSlice.reducer;
