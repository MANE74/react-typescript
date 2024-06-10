import { useState, useEffect, useCallback } from 'react';
import { getLocationById } from '../../apis/locationAPI';
import { Location } from '../../containers/GroupDetail/groupDetailSlice/types';

export const useLocation = (locationId: number | null) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);

  let mounted = true;
  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    if (!locationId) return setLocation(null);
    const location = await getLocationById(locationId);
    if (mounted) {
      location && setLocation(location);
      setIsLocationLoading(false);
    }
  };

  const getCurrentLocationCallback = useCallback(getCurrentLocation, [
    locationId,
    mounted,
  ]);

  useEffect(() => {
    getCurrentLocationCallback();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
      setIsLocationLoading(false);
    };
  }, [getCurrentLocationCallback, locationId]);

  return { location, isLocationLoading };
};
