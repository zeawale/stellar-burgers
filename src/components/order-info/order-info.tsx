import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsLoading
} from '../../services/slices/orderSlice';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

type OrderInfoProps = {
  showOrderNumber?: boolean;
};

type IngredientsWithCount = Record<string, TIngredient & { count: number }>;

export const OrderInfo: FC<OrderInfoProps> = ({ showOrderNumber = true }) => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const order = useSelector(selectOrderDetails);
  const isOrderLoading = useSelector(selectOrderDetailsLoading);
  const orderError = useSelector(selectOrderDetailsError);

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }

    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, ingredients.length]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) {
      return null;
    }

    const ingredientsMap: IngredientsWithCount = {};

    order.ingredients.forEach((id: string) => {
      const existing = ingredientsMap[id];

      if (existing) {
        existing.count += 1;
        return;
      }

      const ingredient = ingredients.find((ing: TIngredient) => ing._id === id);
      if (ingredient) {
        ingredientsMap[id] = {
          ...ingredient,
          count: 1
        };
      }
    });

    const total = Object.values(ingredientsMap).reduce(
      (acc: number, ing: TIngredient & { count: number }) =>
        acc + ing.price * ing.count,
      0
    );

    return {
      ...order,
      ingredientsInfo: ingredientsMap,
      date: new Date(order.createdAt),
      total
    };
  }, [order, ingredients]);

  if (isOrderLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  if (!orderInfo || orderError) {
    return <p className='pt-6 text text_type_main-medium'>Заказ не найден</p>;
  }

  return (
    <OrderInfoUI orderInfo={orderInfo} showOrderNumber={showOrderNumber} />
  );
};
