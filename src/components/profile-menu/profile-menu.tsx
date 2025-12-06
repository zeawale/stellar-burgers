import { FC, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        localStorage.removeItem('refreshToken');
        document.cookie = 'accessToken=; Max-Age=0; path=/';
        navigate('/login', { replace: true });
      })
      .catch(() => {});
  }, [dispatch, navigate]);

  return <ProfileMenuUI pathname={pathname} handleLogout={handleLogout} />;
};
