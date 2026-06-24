import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burgerConstructorSlice';

import { BurgerConstructorState } from '../burgerConstructorSlice';

const bun = {
  _id: 'bun1',
  name: 'Булка',
  type: 'bun',
  calories: 100,
  fat: 10,
  proteins: 5,
  carbohydrates: 15,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: '',
  id: 'uuid-bun'
};

const sauce = {
  _id: 'sauce1',
  name: 'Соус',
  type: 'sauce',
  calories: 10,
  fat: 1,
  proteins: 2,
  carbohydrates: 3,
  price: 15,
  image: '',
  image_large: '',
  image_mobile: ''
};

const filling = {
  _id: 'fill1',
  name: 'Начинка',
  type: 'main',
  calories: 200,
  fat: 20,
  proteins: 10,
  carbohydrates: 25,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('burgerConstructorSlice', () => {
  let initialState: BurgerConstructorState;

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: []
    };
  });

  test('должен вернуть initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('добавление булки', () => {
    const action = addIngredient(bun);
    const state = reducer(initialState, action);

    expect(state.bun).not.toBeNull();
    expect(state.bun?.type).toBe('bun');
  });

  test('добавление ингредиента (соус/начинка)', () => {
    const action = addIngredient(sauce);
    const state = reducer(initialState, action);

    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]._id).toBe('sauce1');
  });

  test('удаление ингредиента', () => {
    const added = reducer(initialState, addIngredient(sauce));
    const id = added.ingredients[0].id;

    const state = reducer(added, removeIngredient(id));

    expect(state.ingredients.length).toBe(0);
  });

  test('перемещение ингредиентов', () => {

    let state = reducer(initialState, addIngredient(sauce));
    state = reducer(state, addIngredient(filling));

    const firstId = state.ingredients[0].id;
    const secondId = state.ingredients[1].id;

    const moved = reducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(moved.ingredients[0].id).toBe(secondId);
    expect(moved.ingredients[1].id).toBe(firstId);
  });

  test('очистка конструктора', () => {
    let state = reducer(initialState, addIngredient(sauce));
    state = reducer(state, addIngredient(filling));
    state = reducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(0);
  });
});
