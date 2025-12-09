import { FC, PropsWithChildren, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  selectIsAuthChecked,
  selectUserLoading,
  getUser
} from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = PropsWithChildren<{
  onlyUnAuth?: boolean;
}>;

type LocationState = {
  from?: string;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isUserLoading = useSelector(selectUserLoading);

  useEffect(() => {
    if (!isAuthChecked && !user) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthChecked, user]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  const isLoggedIn = Boolean(user);
  const state = location.state as LocationState | null;

  if (onlyUnAuth && isLoggedIn) {
    const redirectTo = state?.from ?? '/';
    return <Navigate to={redirectTo} replace />;
  }

  if (!onlyUnAuth && !isLoggedIn) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  return children as JSX.Element;
};
