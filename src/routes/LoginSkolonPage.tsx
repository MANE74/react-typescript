import React, { useEffect } from 'react';
import { getSsoUrl } from '../containers/Login/LoginSlice/actionCreators';
import { logoutUser } from '../containers/Sidebar/actionCreators';
import { useAppDispatch } from '../hooks';

function LoginSkolonPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logoutUser());
    loginSkolon();
  }, []);

  const loginSkolon = async () => {
    dispatch(getSsoUrl(null, 'Skolon'));
  };

  return <div></div>;
}

export default LoginSkolonPage;
