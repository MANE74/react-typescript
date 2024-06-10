import { useCallback, useEffect, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Map } from '../Map/Map';
import { Marker } from '../Map/MapMarker/MapMarker';
import { debounce } from 'lodash';
import styled from 'styled-components';
import { apiKey } from '../../utils/geocoder';

interface MapMessageViewProps {
  longitude: number;
  latitude: number;
  onClick?: () => void;
  modal?: boolean;
}

export const SMapMessageView = styled.div<any>`
  max-width: 100%;
  height: ${(props) => (props.modal ? '70vh' : '20vh')};
  width: 100vw;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
  border-top-right-radius: ${(props) => props.modal && '13px'};
  border-top-left-radius: ${(props) => props.modal && '13px'};
`;

export const MapMessageView = (props: MapMessageViewProps) => {
  const { longitude = 0, latitude = 0, onClick, modal } = props;
  const StandardZoom = 12; // initial zoom: ;
  const [zoom, setZoom] = useState(StandardZoom);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  let mounted = true;

  // Here we debounce the function which resets zoom and center for the map after specific time of user inactivity.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handler = useCallback(
    debounce((center: google.maps.LatLngLiteral) => {
      if (mounted) {
        setZoom(StandardZoom);
        setCenter(center);
      }
    }, 6000),
    []
  );

  // when user is not making any action in the map this is the function that will run
  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);

    setCenter(m.getCenter()!.toJSON());

    handler({
      lat: latitude,
      lng: longitude,
    });
  };

  useEffect(() => {
    if (longitude && latitude) {
      setCenter({
        lat: latitude,
        lng: longitude,
      });
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
    };
  }, [latitude, longitude]);

  return (
    <SMapMessageView onClick={onClick} modal={modal}>
      <Wrapper apiKey={apiKey!} libraries={['places']}>
        <Map
          center={center}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: '1', height: '100%' }}
          disableDefaultUI
          clickableIcons={false}
          gestureHandling="cooperative"
        >
          <Marker position={{ lat: latitude, lng: longitude }} />
        </Map>
      </Wrapper>
    </SMapMessageView>
  );
};
