import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '@api';
import type { RootState } from '../store';

type OrderHistoryState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

type PublicFeedState = OrderHistoryState & {
  total: number;
  totalToday: number;
};

export interface OrderFeedState {
  general: PublicFeedState;
  profile: OrderHistoryState;
}

const initialState: OrderFeedState = {
  general: {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  },
  profile: {
    orders: [],
    loading: false,
    error: null
  }
};

type FeedResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const fetchFeeds = createAsyncThunk<FeedResponse>(
  'feed/fetchFeeds',
  async () => await getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'feed/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.general.loading = true;
        state.general.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.general.loading = false;
        state.general.orders = action.payload.orders;
        state.general.total = action.payload.total;
        state.general.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.general.loading = false;
        state.general.error =
          action.error.message || 'Ошибка загрузки ленты заказов';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      });
  }
});

export const selectFeedOrders = (state: RootState) => state.feed.general.orders;
export const selectFeedTotal = (state: RootState) => state.feed.general.total;
export const selectFeedTotalToday = (state: RootState) =>
  state.feed.general.totalToday;

export const selectProfileOrders = (state: RootState) =>
  state.feed.profile.orders;

export const selectProfileLoading = (state: RootState) =>
  state.feed.profile.loading;

export const selectProfileError = (state: RootState) =>
  state.feed.profile.error;

export default feedSlice.reducer;
