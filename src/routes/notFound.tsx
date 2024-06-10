import { getItem } from '../utils/storage';
import { Navigate } from 'react-router';

export const NotFoundPage = () => {
  const user = getItem('user');

  if (user) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/intro" />;
  }
};
