import _ from 'lodash';
import { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { Chat } from '../../containers/ChatsList/chatListSlice/types';
import { selectUser } from '../../containers/Login/LoginSlice';
import { useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { AlarmTypes, ReceivedMessageType } from '../../utils/enums';
import { AlertMessage } from './AlertMessage/AlertMessage';
import AudioMessage from './AudioMessage/AudioMessage';
import FileMessage from './FileMessage/FileMessage';
import ImageMessage from './ImageMessage/ImageMessage';
import LocationMessage from './LocationMessage.tsx/LocationMessage';
import TextMessage from './TextMessage/TextMessage';

interface MessageItemProps {
  message: Chat;
  onPlayClick: (id: number | null) => void;
  isAudioActive: boolean;
  alertType: AlarmTypes;
  alert: boolean;
  toggleOptions: () => void;
  onMapClick: (
    longitude: number,
    latitude: number,
    address: string,
    date: string,
    isAlarm: boolean
  ) => void;
}

export const MessageItem = (props: MessageItemProps) => {
  const {
    message,
    alertType,
    toggleOptions,
    isAudioActive,
    onPlayClick,
    onMapClick,
  } = props;

  const user = useAppSelector(selectUser);
  const isLocationMessage = message.locationID && message.type !== 2;
  const isTextMessage =
    message.text &&
    !_.isEmpty(message.text.trim()) &&
    _.isEmpty(message.photoFileNames) &&
    message.type !== ReceivedMessageType.Alarm &&
    !isLocationMessage &&
    _.isEmpty(message.documentFileNames);
  const forwarded = message.type === 12;

  const [isMessageSent, setIsMessageSent] = useState<boolean>(true);

  useLayoutEffect(() => {
    if (user) {
      if (user.id !== message.senderID) setIsMessageSent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getMessageToText = () => {
    if (message.groupNames.length) {
      return message.groupNames.join(', ');
    }
    if (message.type === ReceivedMessageType.LogFile) {
      return 'Log file';
    }
    if (
      message.type === ReceivedMessageType.Broadcast &&
      (message.Organization || message.organizations.length > 0)
    ) {
      if (message.organizations.length)
        return message.organizations.map((e) => e.name + ', ');
      return message.Organization;
    }
    if (
      !message.groupNames.length &&
      message.type !== ReceivedMessageType.Broadcast &&
      message.type !== ReceivedMessageType.LogFile &&
      message?.messageRecipients
    ) {
      return _.map(
        message.messageRecipients,
        (recip) => recip.displayName
      ).join(', ');
    }
    return null;
  };

  return (
    <>
      <SMessageDateSeparator>
        {getDateFormatCustom(message.sent, dateFormats.mothNamePlusDate)}
      </SMessageDateSeparator>
      {isLocationMessage && (
        <LocationMessage
          text={message.text}
          isSent={isMessageSent}
          sentDateTime={getDateFormatCustom(
            message.sent,
            dateFormats.mothNameDateTime
          )}
          senderName={message.senderName}
          locationId={message.locationID}
          senderImage={message.profilePictureFileName}
          toggleModal={toggleOptions}
          messageTo={getMessageToText()}
          subject={message.subject}
          forwarded={forwarded}
          edited={message.edited}
          onMapClick={(lat, lng, address) => {
            onMapClick(
              lat,
              lng,
              address,
              getDateFormatCustom(
                message.sent,
                dateFormats.yearMonthDayTimeNoComma24
              ),
              false
            );
          }}
        />
      )}
      {isTextMessage && (
        <TextMessage
          isSent={isMessageSent}
          sentDateTime={getDateFormatCustom(
            message.sent,
            dateFormats.simpleTime
          )}
          messageText={message.text}
          senderName={message.senderName}
          senderImage={message.profilePictureFileName}
          toggleModal={toggleOptions}
          hideMenu={false}
          messageTo={getMessageToText()}
          subject={message.subject}
          forwarded={forwarded}
          edited={message.edited}
        />
      )}
      {message.type === ReceivedMessageType.Alarm && (
        <AlertMessage
          messageText={message.text}
          message={message}
          messageTo={getMessageToText()}
          subject={message.subject}
          senderName={message.senderName}
          senderImage={message.profilePictureFileName}
          isSent={isMessageSent}
          sentDateTime={getDateFormatCustom(
            message.sent,
            dateFormats.yearMonthDayTimeNoComma24
          )}
          alertType={alertType}
          toggleModal={toggleOptions}
          forwarded={forwarded}
          onMapClick={(lat, lng, address) => {
            onMapClick(
              lat,
              lng,
              address,
              getDateFormatCustom(message.sent, dateFormats.simpleTime),
              true
            );
          }}
        />
      )}
      {message.photoFileNames?.length !== 0 && (
        <ImageMessage
          photoFileNames={message.photoFileNames!}
          senderName={message.senderName}
          senderImage={message.profilePictureFileName}
          isSent={isMessageSent}
          sentDateTime={getDateFormatCustom(
            message.sent,
            dateFormats.simpleTime
          )}
          messageText={message.text}
          toggleModal={toggleOptions}
          messageTo={getMessageToText()}
          subject={message.subject}
          forwarded={forwarded}
          edited={message.edited}
        />
      )}
      {!_.isEmpty(message.documentFileNames) && (
        <FileMessage
          text={message.text}
          messageTo={getMessageToText()}
          subject={message.subject}
          key={`file${message.id}`}
          documents={message.attachments || []}
          senderName={message.senderName}
          senderImage={message.profilePictureFileName}
          isSent={isMessageSent}
          forwarded={forwarded}
          sentDateTime={getDateFormatCustom(
            message.sent,
            dateFormats.simpleTime
          )}
          toggleModal={toggleOptions}
          edited={message.edited}
        />
      )}
      {!_.isEmpty(message.audioFileNames) && (
        <AudioMessage
          messageId={message.id}
          messageTo={getMessageToText()}
          subject={message.subject}
          key={`audio${message.id}`}
          isSent={isMessageSent}
          sentDateTime={getDateFormatCustom(
            message.sent,
            dateFormats.simpleTime
          )}
          senderImage={message.profilePictureFileName}
          audioFile={_.head(message.audioFileNames)!}
          isAudioActive={isAudioActive}
          senderName={message.senderName}
          onPlayClick={onPlayClick}
          toggleModal={toggleOptions}
          forwarded={forwarded}
          edited={message.edited}
        />
      )}
    </>
  );
};

export const SMessageDateSeparator = styled.p`
  padding-top: 1rem;
  text-align: center;
  color: ${palette.silver};
  font-size: 13px;
  font-family: 'Roboto-Regular';
`;
