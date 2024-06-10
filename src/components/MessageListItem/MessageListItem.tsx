import { t } from 'i18next';
import _ from 'lodash';
import {
  checkIfDateIsToday,
  dateFormats,
  getDateFormatCustom,
} from '../../utils/date';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import {
  MessageItemContainer,
  SDots,
  MessageItemWrapper,
  ProfileContainer,
  MessagesContainer,
  ContentRaw,
  TextName,
  TextInfo,
  TextMessage,
  SDotsWrapper,
  SArrow,
  ContentImgRaw,
} from './MessageListItem.styles';
import Dots from '../../assets/imgs/general/option-dots.svg';
import { ReceivedMessageType } from '../../utils/enums';
import { translate } from '../../utils/translate';
import { BroadcastMsg } from '../../containers/Broadcast/broadcastSlice/types';
import { Chat as ChatType, Reply } from '../../containers/ChatsList/chatListSlice/types';
import { useState } from 'react';
import ChatReply from '../MessageItem/ChatReply/ChatReply';
import { Modal } from '../Modal/Modal';
import MapModal from '../MapModal/MapModal';

export interface MessageListItemProps {
  message: BroadcastMsg;
  userId: number;
  handleDots: (id: number) => void;
}

export const MessageListItem = (props: MessageListItemProps) => {
  const { message, userId, handleDots } = props;
  const [activeAudio, setActiveAudio] = useState<number | null>(null);
  const [showBottomTabs, setShowBottomTabs] = useState(true);
  const [selectedChat, setSelectedChat] = useState<ChatType | Reply | null>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapState, setMapState] = useState<{
    longitude: number;
    latitude: number;
    address: string;
    sent?: string;
  }>({
    longitude: 0,
    latitude: 0,
    address: '',
    sent: undefined,
  });

  const broadcast = message?.type === ReceivedMessageType.Broadcast;
  const reply = {
    id: message.id,
    sent: message.sent,
    text: message.text,
    senderID: message.senderID,
    senderName: message.senderName,
    photoFileName: message.photoFileName,
    photoFileNames: message.photoFileNames,
    audioFileNames: message.audioFileNames,
    locationID: message.locationID,
    locationName: message.locationName,
    documentFileNames: message.documentFileNames,
    documentFileName: message.documentFileName
  };
  
  const getDateFormat = (date: string) => {
    return new Date(date.replace(' ', 'T') + 'Z');
  };
  const sameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const handleTime = (time: string) => {
    return getDateFormatCustom(time!, dateFormats.simpleTime);
  };

  const getMessageSender = (message: BroadcastMsg) => {
    const { lastReplySenderId, senderID, lastReplySender, senderName } =
      message;
    const lastSenderId = lastReplySenderId || senderID;
    if (userId === lastSenderId) {
      const sender = t('messages_you');
      return sender;
    } else {
      return lastReplySender || senderName;
    }
  };

  const getMessagerecipients = (message: BroadcastMsg, option?: string) => {
    const { organizations } = message;
    if (option === 'name') {
      const sender = _.map(organizations, (org) => org.name).join(', ');
      return sender;
    } else {
      return organizations;
    }
  };

  const playAudio = (id: number | null) => {
    setActiveAudio(id);
  };

  const toggleMapModal = (
    lng: number,
    lat: number,
    address: string,
    sent?: string
  ) => {
    setMapState({
      latitude: lat,
      longitude: lng,
      address: address,
      sent: sent,
    });
    setMapModalOpen(!mapModalOpen);
  };

  const thisReplyDate = getDateFormat(reply.sent);
  const thisReplySenderID = reply.senderID;
  const prevReplySenderID = reply.senderID;
  const prevReplyDate = getDateFormat(reply.sent);
  const messageSentDate = getDateFormat(message.sent);
  const isSameDay = prevReplyDate
    ? sameDay(prevReplyDate, thisReplyDate)
    : sameDay(messageSentDate, thisReplyDate);

  const handleDate = (time: string) => {
    return getDateFormatCustom(
      time!,
      dateFormats.mothNamePlusDate
    );
  };

  return (
    <MessageItemContainer selected={false}>
      {mapModalOpen && (
        <Modal isOpen={mapModalOpen} setIsOpen={setMapModalOpen}>
          <MapModal
            longitude={mapState.longitude}
            latitude={mapState.latitude}
            address={mapState.address}
            type={message.emergencyTypeName!}
            recalled={message.recalled}
            sent={
              mapState.sent
                ? mapState.sent
                : getDateFormatCustom(
                    message.sent,
                    dateFormats.mothNameDateTime
                  )
            }
          />
        </Modal>
      )}
      <MessageItemWrapper>
        {/* <ProfileContainer>
          {broadcast && (
            <img style={{ padding: '0.5rem' }} src={Broadcast} alt="" />
          )}
          {message?.groupID && !broadcast && (
            <ProfilePicture profilePictureFileName={''} />
          )}
          {!message?.groupID && !broadcast && (
            <ProfilePicture profilePictureFileName={''} isGroup />
          )}
        </ProfileContainer> */}

        <MessagesContainer>
          <SArrow></SArrow>

          <SDotsWrapper onClick={() => handleDots(message?.id)}>
            <SDots src={Dots} alt="" />
          </SDotsWrapper>
          
          <ContentRaw>
            <TextName>
              {getMessageSender(message)}
            </TextName>
          </ContentRaw>

          <ContentRaw>
            <TextInfo>{translate('messages_to')} {getMessagerecipients(message, 'name')}</TextInfo>
          </ContentRaw>

          <ContentRaw>
            <TextInfo>{translate('messages_subject')} {message?.subject}</TextInfo>
          </ContentRaw>

          <ContentRaw>
            <TextMessage>{message?.text}</TextMessage>
          </ContentRaw>

          <ContentImgRaw>
              <ChatReply
                key={reply.id}
                reply={reply}
                userId={userId}
                isSameDay={isSameDay}
                isSameSender={thisReplySenderID === prevReplySenderID}
                emergencyTypeName={message.emergencyTypeName}
                setShowBottomTabs={setShowBottomTabs}
                onPlayClick={playAudio}
                isAudioActive={reply.id === activeAudio}
                toggleOptions={() => {
                  setSelectedChat(reply);
                  setOptionsOpen(!optionsOpen);
                }}
                onMapClick={toggleMapModal}
                showOnlyAttachment={true}
              />
          </ContentImgRaw>

          {/* <ContentRaw>
            <TextDate>
              {handleTime(message?.lastReplySent || message?.sent!)}
            </TextDate>
          </ContentRaw> */}

        </MessagesContainer>
      </MessageItemWrapper>
    </MessageItemContainer>
  );
};
