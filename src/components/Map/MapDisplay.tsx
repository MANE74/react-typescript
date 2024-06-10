import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import BigFloatButton from '../BigFloatButton/BigFloatButton';
import SearchableMap from '../SearchableMap/SearchableMap';

interface MapDisplayProps {
  location: google.maps.LatLngLiteral;
  setLocation: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral>>;
  onButtonClick: () => void;
  buttonColor: 'red' | 'yellow';
  buttonTx: string;
  handleClickBack?: () => void;
  backLink?: string;
}

function MapDisplay(props: MapDisplayProps) {
  const {
    location,
    setLocation,
    onButtonClick,
    buttonColor,
    buttonTx,
    handleClickBack,
    backLink,
  } = props;

  const layout = useLayoutContext();
  const locationState = useLocation();
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    backLink && layout.setBackLink(backLink);
    layout.setMessage('messages_location');
    layout.setSubTitle('');
    layout.setDoShowDots(false);
  }, []);

  useLayoutEffect(() => {
    if (mounted) {
      if (handleClickBack) {
        handleClickBack();
        layout.setBackLink(undefined);
        layout.setDoShowDots(undefined);
      }
      layout.setMessage(undefined);
    } else {
      setMounted(true);
    }
  }, [locationState]);

  const handleButtonClick = () => {
    layout.setBackLink(undefined);
    layout.setDoShowDots(undefined);
    navigate('#');
    onButtonClick();
  };

  return (
    <SMapContainer>
      <SearchableMap location={location} setLocation={setLocation} />
      <BigFloatButton
        extraPadding={false}
        tx={buttonTx}
        onClick={handleButtonClick}
        color={buttonColor}
      />
    </SMapContainer>
  );
}

export default MapDisplay;

export const SMapContainer = styled.div`
  position: fixed;
  max-width: 26rem;
  z-index: 9;
  top: 0;
  width: 100%;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
`;
