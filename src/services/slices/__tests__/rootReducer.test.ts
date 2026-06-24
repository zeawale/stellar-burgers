import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from '../ingredientsSlice';
import burgerConstructorReducer from '../burgerConstructorSlice';
import userReducer from '../userSlice';
import feedReducer from '../feedSlice';
import orderReducer from '../orderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer,
  feed: feedReducer,
  order: orderReducer
});

describe('rootReducer', () => {
  test('должен быть функцией', () => {
    expect(typeof rootReducer).toBe('function');
  });

  test('возвращает корректный initialState', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        loading: false,
        error: null
      },

      burgerConstructor: {
        bun: null,
        ingredients: []
      },

      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },

      feed: {
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
      },

      order: {
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
      }
    });
  });
});
