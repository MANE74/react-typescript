import { decode } from 'html-entities';
import React from 'react';
import styled from 'styled-components';
import { palette } from '../../../theme/colors';
import { useLocation } from '../../../utils/customHooks/useLocation';
import { MessageType } from '../../../utils/enums';
import { translate } from '../../../utils/translate';
import {
  MapMessageView,
  SMapMessageView,
} from '../../MapMessageView/MapMessageView';
import MessageContainer from '../../MessageContainer/MessageContainer';
import { SDescription } from '../FileMessage/FileMessage';
import PlaceholderMap from '../../../assets/imgs/chats/map-placeholder.svg';

export interface LocationMessageProps {
  text: string;
  isSent: boolean;
  sentDateTime: string;
  senderName: string;
  senderImage: string | null;
  locationId: number | null;
  isSameSender?: boolean;
  messageTo: string | null;
  subject: string | null;
  toggleModal?: () => void;
  onMapClick: (longitude: number, latitude: number, address: string) => void;
  showOnlyAttachment?: boolean;
  forwarded?: boolean;
  edited?: boolean;
}

function LocationMessage(props: LocationMessageProps) {
  const {
    text,
    subject,
    isSent,
    sentDateTime,
    senderName,
    senderImage,
    locationId,
    messageTo,
    toggleModal,
    onMapClick,
    forwarded,
    edited,
    showOnlyAttachment = false,
  } = props;

  const { location, isLocationLoading } = useLocation(locationId);

  const messageType = isSent
    ? MessageType.SentLocationMessage
    : MessageType.ReceivedLocationMessage;

  return (
    <div>
      <MessageContainer
        messageType={messageType}
        sentDateTime={sentDateTime}
        senderImage={senderImage}
        senderName={senderName}
        messageTo={messageTo}
        toggleModal={toggleModal}
        showOnlyAttachment={showOnlyAttachment}
        subject={subject}
        forwarded={forwarded}
        edited={edited}
      >
        <div>
          <div>
            <STextContainer>
              {text && <SDescription>{decode(text)}</SDescription>}
              <SLocationAndTime>
                {(location && location.name ? location.name : '') +
                  ', ' +
                  sentDateTime}
              </SLocationAndTime>
            </STextContainer>
            {!isLocationLoading && location ? (
              <MapMessageView
                longitude={Number(location?.longitude)}
                latitude={Number(location?.latitude)}
                onClick={() =>
                  onMapClick(
                    Number(location?.longitude),
                    Number(location?.latitude),
                    location.name!
                  )
                }
              />
            ) : (
              <SMapMessageView>
                <SNoMapContainer>
                  <img src={PlaceholderMap} alt="" />
                </SNoMapContainer>
              </SMapMessageView>
            )}
          </div>
        </div>
      </MessageContainer>
    </div>
  );
}

const SNoMapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  place-content: center;

  img {
    width: 100%;
    height: 100%;
    filter: blur(2px);
    object-fit: cover;
    opacity: 0.5;
  }
`;

const STextContainer = styled.div`
  margin-left: 0.75rem;
  margin-bottom: 6px;
`;

const SLocationAndTime = styled.p`
  font-size: 12px;
  color: ${palette.silver};
`;

export default LocationMessage;
