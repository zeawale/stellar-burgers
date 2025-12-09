import { FC, SyntheticEvent, useEffect, useState, ChangeEvent } from 'react';

import { ProfileUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  selectUserLoading,
  updateUser
} from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isUserLoading = useSelector(selectUserLoading);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  if (isUserLoading && !user) {
    return <Preloader />;
  }

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const updatePayload: {
      name: string;
      email: string;
      password?: string;
    } = {
      name: formValue.name,
      email: formValue.email
    };

    if (formValue.password) {
      updatePayload.password = formValue.password;
    }

    dispatch(updateUser(updatePayload))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch(() => {});
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

export default Profile;
