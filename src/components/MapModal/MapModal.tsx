import React from 'react';
import styled, { css } from 'styled-components';
import { MapMessageView } from '../MapMessageView/MapMessageView';
import { ReactComponent as LocationPin } from '../../assets/imgs/chats/location-pin-shadow.svg';
import { palette } from '../../theme/colors';
import { useTranslation } from 'react-i18next';

interface MapModalProps {
  isAlarm?: boolean;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  sent: string;
  recalled: boolean;
  withoutRecalledLabel?: boolean;
  withDate?: boolean;
}

function MapModal(props: MapModalProps) {
  const {
    isAlarm = true,
    latitude,
    longitude,
    address,
    type,
    sent,
    recalled,
    withoutRecalledLabel = false,
    withDate = false,
  } = props;
  const { t } = useTranslation();

  return (
    <SMapModal>
      <MapMessageView longitude={longitude} latitude={latitude} modal={true} />
      <SLocationContainer>
        <LocationPin width={22} />
        <p>{address} </p>
      </SLocationContainer>
      <SInfoContainer
        $withDate={withDate}
        $withoutRecalledLabel={withoutRecalledLabel}
        recalled
      >
        {isAlarm && <p className="title">{type}</p>}
        <p className="date">{`${t('imOk_updated')} ${sent}`}</p>
        {isAlarm && !withoutRecalledLabel && (
          <p className="subText">
            {recalled ? t(`recalled`) : t(`messages_active`)}
          </p>
        )}
      </SInfoContainer>
    </SMapModal>
  );
}

const SMapModal = styled.div`
  max-width: 21rem;
  height: 70vh;
`;

const SLocationContainer = styled.div`
  position: absolute;
  top: 3%;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 0.75rem 1rem;
  background-color: ${palette.prussianBlue2};
  border-radius: 10px;
  max-width: 18rem;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 0.75rem;

  p {
    font-family: 'Roboto-Regular';
    font-weight: 500;
    font-size: 14px;
  }
`;

const SInfoContainer = styled.div<any>`
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 0.75rem 1rem;
  background-color: ${palette.prussianBlue2};
  border-radius: 10px;
  max-width: 18rem;
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: start;
  gap: 0.1rem;
  .title {
    font-family: 'Roboto-Regular';
    font-weight: 700;
    font-size: 16px;
  }
  .date {
    font-family: 'Roboto-Regular';
    font-weight: 500;
    font-size: 10px;
    color: ${palette.silver};
  }
  .subText {
    font-family: 'Roboto-Regular';
    font-weight: 500;
    font-size: 10px;
    color: ${props => props.recalled && palette.tartOrange};
  }
  ${props =>
    props.$withDate &&
    props.$withoutRecalledLabel &&
    css`
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    `}
`;

export default MapModal;
