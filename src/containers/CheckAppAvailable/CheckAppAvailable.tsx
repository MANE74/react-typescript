import * as React from 'react';
import { OfflineApp } from '../../components/OfflineApp/OfflineApp';
import { useAppSelector } from '../../hooks';
import { selectIsOnLine } from './checkAppAvailableSlice';
import { checkNetworkAvailabilty } from './helpers';

export const CheckAppAvailable = ({ children }: { children: JSX.Element }) => {
  const isOnline = useAppSelector(selectIsOnLine);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (!isOnline) {
      interval = setInterval(
        () => checkNetworkAvailabilty({ checkIfNetworkBack: true }),
        5000
      );
    }
    if (isOnline) {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOnline]);

  return <>{isOnline ? children : <OfflineApp />}</>;
};
