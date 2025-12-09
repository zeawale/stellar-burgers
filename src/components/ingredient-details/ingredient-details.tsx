import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData =
    ingredients.find((item: TIngredient) => item._id === id) ?? null;

  if (isLoading || !ingredients.length || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
