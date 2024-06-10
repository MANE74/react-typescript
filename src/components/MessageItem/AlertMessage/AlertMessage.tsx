import styled, { css } from 'styled-components';
import { useLocation } from '../../../utils/customHooks/useLocation';
import { AlarmTypes, MessageType } from '../../../utils/enums';
import {
  MapMessageView,
  SMapMessageView,
} from '../../MapMessageView/MapMessageView';
import { palette } from '../../../theme/colors';
import MessageContainer from '../../MessageContainer/MessageContainer';
import { useEffect, useState } from 'react';
import { getImage } from '../../../apis/mediaAPI';
import PlaceholderMap from '../../../assets/imgs/chats/map-placeholder.svg';
import { ReactComponent as TriangleError } from '../../../assets/imgs/chats/triangle-error.svg';
import { SMessageText } from '../TextMessage/TextMessage';
import { translate } from '../../../utils/translate';
import { decode } from 'html-entities';

interface AlertMessageProps {
  isSent: boolean;
  sentDateTime: string;
  message: any;
  senderName: string;
  senderImage: string | null;
  alertType: AlarmTypes;
  messageTo: string | null;
  subject: string | null;
  toggleModal?: () => void;
  messageText?: string;
  onMapClick?: (longitude: number, latitude: number, address: string) => void;
  forwarded?: boolean;
}

export const AlertMessage = (props: AlertMessageProps) => {
  const {
    message,
    subject,
    isSent,
    sentDateTime,
    senderImage,
    senderName,
    messageTo,
    toggleModal,
    messageText,
    forwarded,
    onMapClick,
  } = props;

  const { location, isLocationLoading } = useLocation(message.locationID);
  const [image, setImage] = useState('');

  useEffect(() => {
    getAlarmImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message?.id]);

  const getAlarmImage = async () => {
    if (message?.emergencyTypeIconFileName) {
      const img = await getImage({
        imageName: message?.emergencyTypeIconFileName,
        svg: true,
      });
      setImage(img);
    }
  };
  const messageType =
    isSent && !message.recalled
      ? MessageType.SentAlarmMessage
      : !isSent && !message.recalled
      ? MessageType.ReceivedAlarmMessage
      : isSent && message.recalled
      ? MessageType.SentAlarmRecalledMessage
      : MessageType.ReceivedRecalledAlarmMessage;

  return (
    <>
      <MessageContainer
        messageType={messageType}
        sentDateTime={sentDateTime}
        senderImage={senderImage}
        senderName={senderName}
        messageTo={messageTo}
        toggleModal={toggleModal}
        alert={!message.recalled}
        subject={subject}
        forwarded={forwarded}
      >
        <SAlertContainer isSent={isSent}>
          <SAlertMessageInfoContainer>
            <div className="alertDetailsMessageContainer">
              {image && (
                <div className="alertIconContainer">
                  <img width={24} src={image} alt="" />
                </div>
              )}
              <div style={{ maxWidth: '100%' }}>
                <p className="emergencyType">{message.emergencyTypeName}</p>
                {!isLocationLoading && location && location.name ? (
                  <p className="location">
                    {location.name} {sentDateTime}
                  </p>
                ) : (
                  <p className="location">{sentDateTime}</p>
                )}
                {messageText?.trim() !== '' && messageText && (
                  <SMessageText margin>{decode(messageText)}</SMessageText>
                )}
              </div>
            </div>
          </SAlertMessageInfoContainer>
        </SAlertContainer>
        <SMapWrapper>
          {!isLocationLoading && location ? (
            <MapMessageView
              longitude={Number(location?.longitude)}
              latitude={Number(location?.latitude)}
              onClick={
                onMapClick &&
                (() =>
                  onMapClick(
                    Number(location?.longitude),
                    Number(location?.latitude),
                    location.name!
                  ))
              }
            />
          ) : (
            <SMapMessageView>
              <SNoMapContainer>
                <div>
                  <TriangleError />
                  <p>{translate('messages_alarm_no_location')}</p>
                </div>
                <img src={PlaceholderMap} alt="" />
              </SNoMapContainer>
            </SMapMessageView>
          )}
        </SMapWrapper>
      </MessageContainer>
    </>
  );
};

const SAlertContainer = styled.div<any>`
  ${(props) =>
    !props.isSent &&
    css`
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `}

  margin-left: 0.75rem;
  margin-top: 0.625rem;
`;

const SAlertMessageInfoContainer = styled.div`
  font-size: 12px;
  font-family: 'Roboto-Regular';
  font-weight: 500;

  .alertDetailsMessageContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 0.5rem;
  }

  .alertIconContainer {
    margin-right: 5px;
    display: flex;
  }

  .emergencyType {
    color: ${palette.white};
    padding-bottom: 3px;
  }

  .location {
    color: ${palette.silver};
    flex-shrink: 1;
  }
`;

const SNoMapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  place-content: center;

  div {
    position: absolute;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    place-content: center;
  }

  img {
    width: 100%;
    height: 100%;
    filter: blur(2px);
    object-fit: cover;
    opacity: 0.5;
  }

  p {
    margin: 0.75rem auto 0;
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    width: 80%;
  }
`;

const SMapWrapper = styled.div`
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
`;
