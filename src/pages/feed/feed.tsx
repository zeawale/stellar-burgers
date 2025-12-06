import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import type { RootState } from '../../services/store';

import { fetchFeeds, selectFeedOrders } from '../../services/slices/feedSlice';

import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const loading = useSelector((state: RootState) => state.feed.general.loading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <p className='text text_type_main-medium pt-6'>Заказов пока нет</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

export default Feed;
