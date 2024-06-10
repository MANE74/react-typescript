import { Wrapper } from '@googlemaps/react-wrapper';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Map } from '../Map/Map';
import { Marker } from '../Map/MapMarker/MapMarker';
import { SearchBarBase } from '../SearchBarBase/SearchBarBase';
import { ReactComponent as Geo } from '../../assets/imgs/general/geo.svg';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { defaultLng, defaultLat, apiKey } from '../../utils/geocoder';

export interface SearchableMapProps {
  style?: React.CSSProperties;
  buttonText?: string;
  nextButtonCallback?: (location: Location) => void;
  forceShowLocation?: Location;
  isLoading?: boolean;
  buttonStyle?: React.CSSProperties;
  buttonTextStyle?: React.CSSProperties;
  lng?: number;
  lat?: number;
  location: google.maps.LatLngLiteral;
  setLocation: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral>>;
}

function SearchableMap(props: SearchableMapProps) {
  const { location, setLocation } = props;

  const confirm = useConfirmation();

  const StandardZoom = 16; // initial zoom: ;
  const [zoom, setZoom] = useState(StandardZoom);
  const [mounted, setMounted] = useState(false);

  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lng: defaultLng,
    lat: defaultLat,
  });

  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    requestPermissions();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setLocation(pos);
          setCenter(pos);
        },
        () => {
          setLocation({ lat: defaultLat, lng: defaultLng });
          setCenter({ lat: defaultLat, lng: defaultLng });
          console.log("Can't get location");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      console.log("Browser doesn't support Geolocation");
    }

    return () => {
      setMounted(false);
    };
  }, []);

  // when user is not making any action in the map this is the function that will run
  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  const requestPermissions = () => {
    getUserLocation();
  };

  const getUserLocation = () => {};

  const setUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (mounted) {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        async (error) => {
          console.log('Geolocation Error' + error.code, error.message);
          confirm({
            description: 'turn_on_location_intro',
            onSubmit: () => {},
            confirmText: 'ok',
          });
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    }
  };

  return (
    <SMapView>
      <SSearchWithButton>
        <SSearchBarBase
          fallback={() => {}}
          placeholderTx="documents_search"
          forwardedRef={inputRef}
          // value={}
        />
        <SLocationButton onClick={setUserLocation}>
          <Geo />
        </SLocationButton>
      </SSearchWithButton>
      <Wrapper apiKey={apiKey!} libraries={['places']}>
        <Map
          inputRef={inputRef}
          center={center}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: '1', height: '100%' }}
          disableDefaultUI
          onClick={(e) =>
            setLocation({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })
          }
          onSearch={(lat, lng) => setLocation({ lat: lat, lng: lng })}
          clickableIcons={false}
        >
          <Marker position={{ lat: location.lat, lng: location.lng }} />
        </Map>
      </Wrapper>
    </SMapView>
  );
}

const SSearchWithButton = styled.div`
  position: absolute;
  top: 6.06rem;
  z-index: 99;
  left: 1.25rem;
  width: 100%;
  display: flex;
`;

const SSearchBarBase = styled(SearchBarBase)`
  width: 75%;
  margin-right: 1rem;
`;

const SLocationButton = styled.button`
  cursor: pointer;
  width: 51px;
  border: 1px solid ${palette.queenBlue};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.palette.background.searchBar};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SMapView = styled.div`
  height: 100vh;
`;

export default SearchableMap;
