// useGeoLocation
import { useState, useEffect } from 'react';
import Geocoder from '../geocoder';

interface UseGeoLocationParams {
  GeoOptions?: PositionOptions;
  locationRequired?: boolean;
  locationName?: string;
}

export const useGeoLocation = (params: UseGeoLocationParams) => {
  const { GeoOptions, locationName } = params;

  const [isGettingLocationName, setIsGettingLocationName] =
    useState<boolean>(false);
  const [location, setLocation] = useState<GeolocationPosition>();
  const [_locationName, _setLocationName] = useState<string | undefined>(
    undefined
  );

  const onSuccss = async (position: GeolocationPosition) => {
    const result = await Geocoder({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    _setLocationName(result?.addressName);
    setLocation(position);
    setIsGettingLocationName(false);
  };
  const onError = (error: GeolocationPositionError) => {
    setIsGettingLocationName(false);
    //[TODO]: if (locationRequired) deal with it hardly , maybe use Confirm() and block the process

    switch (error.code) {
      case error.TIMEOUT:
        break;
      case error.POSITION_UNAVAILABLE:
        break;
      case error.PERMISSION_DENIED:
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let mounted = true;
    if ('geolocation' in navigator) {
      if (mounted) {
        setIsGettingLocationName(true);
        navigator.geolocation.getCurrentPosition(onSuccss, onError, GeoOptions);
      }
    } else {
      console.log('Not Available');
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setIsGettingLocationName(false);
      mounted = false;
    };
  }, []);

  return {
    location: location && {
      name: _locationName || locationName || '',
      latitude: location!.coords.latitude,
      longitude: location!.coords.longitude,
    },
    isGettingLocationName,
  };
};
