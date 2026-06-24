import reducer, { initialState, fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

describe('ingredientsSlice', () => {
  test('initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('loading = true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('загрузка завершена, данные записаны', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        calories: 100,
        fat: 20,
        proteins: 10,
        carbohydrates: 30,
        price: 50,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  test('error записан', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };

    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
