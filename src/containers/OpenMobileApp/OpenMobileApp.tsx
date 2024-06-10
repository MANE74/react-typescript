import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { OpenMobilePopup } from '../../components/OpenMobilePopup/OpenMobilePopup';
import { didAskedToGoMobileApp, isMobileBrowser } from './helpers';
import _ from 'lodash';

export const OpenMobileApp = ({ children }: { children: JSX.Element }) => {
  const [showPopup, setShowPopup] = useState(
    isMobileBrowser() && !sessionStorage.getItem('didAskedToGoMobileApp')
  );
  const location = useLocation();
  const from: string = location.state?.from?.pathname || location.pathname;

  const onOpenMobileApp = () => {
    didAskedToGoMobileApp();
    setShowPopup(false);
  };
  const onStayWebApp = () => {
    didAskedToGoMobileApp();
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <OpenMobilePopup
          link={
            process.env.REACT_APP_OPEN_MOBILE_APP +
            encodeURIComponent(`&path=${_.last(from.split('/'))}`)
          }
          onOpenMobileApp={onOpenMobileApp}
          onStayWebApp={onStayWebApp}
        />
      )}
      {children}
    </>
  );
};
