import { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  clearCreationState,
  selectCreationOrder,
  selectCreationProcessing
} from '../../services/slices/orderSlice';
import {
  clearConstructor,
  selectConstructor
} from '../../services/slices/burgerConstructorSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const constructorItems = useSelector(selectConstructor);
  const isOrderProcessing = useSelector(selectCreationProcessing);
  const createdOrder = useSelector(selectCreationOrder);

  const handleOrderClick = useCallback(() => {
    const { bun, ingredients } = constructorItems;

    if (!bun || isOrderProcessing) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => {});
  }, [
    constructorItems,
    isOrderProcessing,
    isAuthenticated,
    navigate,
    dispatch
  ]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(clearCreationState());
  }, [dispatch]);

  const totalPrice = useMemo(() => {
    const { bun, ingredients } = constructorItems;

    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );

    return bunPrice + fillingsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isOrderProcessing}
      constructorItems={constructorItems}
      orderModalData={createdOrder}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
