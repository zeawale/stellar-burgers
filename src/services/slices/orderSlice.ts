import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

type OrderState = {
  creation: {
    data: TOrder | null;
    loading: boolean;
    error: string | null;
  };
  details: {
    data: TOrder | null;
    loading: boolean;
    error: string | null;
  };
};

const initialState: OrderState = {
  creation: {
    data: null,
    loading: false,
    error: null
  },
  details: {
    data: null,
    loading: false,
    error: null
  }
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ids) => {
    const res = await orderBurgerApi(ids);
    return res.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/getByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCreationState(state) {
      state.creation.data = null;
      state.creation.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.creation.loading = true;
      state.creation.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.creation.loading = false;
      state.creation.data = action.payload;
    });
    builder.addCase(createOrder.rejected, (state) => {
      state.creation.loading = false;
      state.creation.error = 'Ошибка создания заказа';
    });

    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.details.loading = true;
      state.details.error = null;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (state, action) => {
      state.details.loading = false;
      state.details.data = action.payload;
    });
    builder.addCase(fetchOrderByNumber.rejected, (state) => {
      state.details.loading = false;
      state.details.error = 'Ошибка загрузки заказа';
    });
  }
});

export const { clearCreationState } = orderSlice.actions;

export const selectCreationOrder = (state: RootState) =>
  state.order.creation.data;
export const selectCreationProcessing = (state: RootState) =>
  state.order.creation.loading;

export const selectOrderDetails = (state: RootState) =>
  state.order.details.data;
export const selectOrderDetailsLoading = (state: RootState) =>
  state.order.details.loading;
export const selectOrderDetailsError = (state: RootState) =>
  state.order.details.error;

export default orderSlice.reducer;
