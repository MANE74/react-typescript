import React from 'react';
import styled, { css } from 'styled-components';
import { MessageType } from '../../utils/enums';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import Dots from '../../assets/imgs/general/option-dots.svg';
import { useTranslation } from 'react-i18next';
import { palette } from '../../theme/colors';
import { ReactComponent as Forwarded } from '../../assets/imgs/chats/forwarded.svg';
import { translate } from '../../utils/translate';
import { ReactComponent as Pencil } from '../../assets/imgs/chats/edit-white.svg';

export interface MessageContainerProps {
  messageType: MessageType;
  children?: React.ReactNode;
  senderImage: string | null;
  isSameSender?: boolean;
  sentDateTime?: string;
  senderName?: string;
  emergencyRecall?: boolean;
  subject: string | null;
  messageTo: string | null;
  toggleModal?: () => void;
  alert?: boolean;
  showOnlyAttachment?: boolean;
  forwarded?: boolean;
  edited?: boolean;
}

function MessageContainer(props: MessageContainerProps) {
  const {
    messageType,
    sentDateTime,
    senderImage,
    isSameSender = false,
    children,
    senderName,
    emergencyRecall = false,
    messageTo,
    subject,
    toggleModal,
    alert,
    showOnlyAttachment = false,
    forwarded,
    edited,
  } = props;

  const { t } = useTranslation();

  const messagesSentList = [
    MessageType.SentAudioMessage,
    MessageType.SentTextMessage,
    MessageType.SentImageMessage,
    MessageType.SentFileMessage,
    MessageType.SentAlarmMessage,
    MessageType.SentAlarmRecalledMessage,
    MessageType.SentLocationMessage,
  ];
  const imageMessagesList = [
    MessageType.SentImageMessage,
    MessageType.ReceivedImageMessage,
  ];
  const recalledAlarmMessagesList = [
    MessageType.SentAlarmRecalledMessage,
    MessageType.ReceivedRecalledAlarmMessage,
  ];
  const alarmMessagesList = [
    MessageType.SentAlarmMessage,
    MessageType.ReceivedAlarmMessage,
    MessageType.SentAlarmRecalledMessage,
    MessageType.ReceivedRecalledAlarmMessage,
  ];
  const locationMessagesList = [
    MessageType.SentLocationMessage,
    MessageType.ReceivedLocationMessage,
  ];

  const isMessageSent = messagesSentList.includes(messageType);
  const isImageMessage = imageMessagesList.includes(messageType);
  const isAlarmMessage = alarmMessagesList.includes(messageType);
  const isAlarmRecalled = recalledAlarmMessagesList.includes(messageType);
  const isAlarmActive = isAlarmMessage && !isAlarmRecalled;
  const isLocationMessage = locationMessagesList.includes(messageType);
  const showProfileImage =
    (!isSameSender && !isMessageSent) || (!emergencyRecall && !isMessageSent);
  const showReceivedMessageTopCorner =
    (!isMessageSent && !isSameSender) || (emergencyRecall && !isMessageSent);
  const showSentMessageTopCorner = isMessageSent && !isSameSender;
  const showImageReplacer = !isMessageSent && emergencyRecall;
  const showSenderName = !isMessageSent && !isSameSender;
  const showTime = !isLocationMessage && !isAlarmMessage;

  return (
    <SMainMessageContainer isMessageSent={isMessageSent}>
      {showProfileImage && (
        <SProfilePictureWrapper>
          <ProfilePicture profilePictureFileName={senderImage} diameter={26} />
        </SProfilePictureWrapper>
      )}
      {showImageReplacer && <div style={{ width: '2rem' }} />}
      {showReceivedMessageTopCorner && (
        <SReceivedMessageTopCorner
          emergencyRecall={emergencyRecall}
          isAlarmActive={isAlarmActive}
          recalledContainer={emergencyRecall}
        >
          <SReceivedMessageTopCornerInner isAlarmActive={isAlarmActive} />
        </SReceivedMessageTopCorner>
      )}
      <SMessageContainer
        sentMessage={isMessageSent}
        messageContainerRounded={isSameSender}
        imageContainer={isImageMessage}
        alarmContainer={isAlarmMessage}
        locationContainer={isLocationMessage}
        recalledContainer={emergencyRecall}
        activeAlertContainer={alert}
        canceledAlertContainer={isAlarmMessage && !alert}
      >
        {toggleModal && !showOnlyAttachment && (
          <SEditMessageButtonContainer margin={showSenderName}>
            <SDots src={Dots} alt="" onClick={() => toggleModal()} />
          </SEditMessageButtonContainer>
        )}
        {forwarded && (
          <SForwarded extraForwardPadding={isAlarmMessage || isLocationMessage}>
            <Forwarded width={12} />
            <p>{translate('messages_forward')}</p>
          </SForwarded>
        )}
        {edited && (
          <SForwarded extraForwardPadding={isAlarmMessage || isLocationMessage}>
            <Pencil width={12} />
            <p>{translate('message_edited')}</p>
          </SForwarded>
        )}
        {showSenderName && (
          <SSenderNameContainer
            toContainerAlarm={isAlarmMessage || isLocationMessage}
          >
            <SSenderName>{senderName}</SSenderName>
          </SSenderNameContainer>
        )}
        {messageTo && (
          <SSenderNameContainer
            toContainerAlarm={isAlarmMessage}
            isLocationMessage={isLocationMessage}
          >
            <SAdditionalInfo isAlarmMessage={isAlarmMessage}>
              {t(`messages_to`)} {messageTo}
            </SAdditionalInfo>
          </SSenderNameContainer>
        )}
        {subject && (
          <SSenderNameContainer isLocationMessage={isLocationMessage}>
            <SAdditionalInfo>
              {t(`messages_subject`)} {subject}
            </SAdditionalInfo>
          </SSenderNameContainer>
        )}

        {children}

        {showTime && (
          <SSentMessageDateContainer>
            <Time>{sentDateTime}</Time>
          </SSentMessageDateContainer>
        )}
      </SMessageContainer>
      {showSentMessageTopCorner && (
        <SSentMessageTopCorner
          isAlarmActive={isAlarmActive}
          recalledContainer={emergencyRecall}
        >
          {!showOnlyAttachment && (
            <SSentMessageTopCornerInner isAlarmActive={isAlarmActive} />
          )}
        </SSentMessageTopCorner>
      )}
    </SMainMessageContainer>
  );
}

const SMainMessageContainer = styled.div<any>`
  position: relative;
  display: flex;
  padding-top: 10px;
  flex-direction: row;

  justify-content: ${(props) => props.isMessageSent && 'flex-end'};
`;

const SProfilePictureWrapper = styled.div`
  margin-right: 4px;
`;

const SReceivedMessageTopCorner = styled.div<any>`
  height: 21px;
  width: 0.5rem;
  background-color: ${(props) =>
    props.recalledContainer ? palette.stormGray : palette.cloudBurst};
  justify-content: flex-end;
  border-left-color: transparent;

  ${(props) =>
    props.isAlarmActive &&
    css`
      border-style: solid;
      border-right-color: ${palette.navyBlue};
      border-color: ${palette.navyBlue};
      margin-right: -1px;
      z-index: 2;
      border-top-color: ${palette.tartOrange};
      border-top-width: 1px;
    `};
`;

const SReceivedMessageTopCornerInner = styled.div<any>`
  height: 21px;
  background-color: ${palette.navyBlue};
  border-top-right-radius: 0.5rem;
  border-left-color: transparent;
  margin-top: 0;
  min-width: 0.5rem;

  ${(props) =>
    props.isAlarmActive &&
    css`
      margin-top: -1px;
      border-style: solid;
      border-right-color: ${palette.tartOrange};
      border-top-color: ${palette.tartOrange};
      border-top-width: 1px;
      margin-right: 0;
      border-right-width: 1px;
      border-left-width: 1px;
    `}
`;

const SSentMessageTopCorner = styled(SReceivedMessageTopCorner)<any>`
  border-left-color: transparent;
  background-color: ${palette.charcoal2};

  ${(props) =>
    props.isAlarmActive &&
    css`
      border-style: solid;
      border-color: ${palette.navyBlue};
      border-right-color: ${palette.navyBlue};
      margin-left: -1px;
      z-index: 2;
      border-top-color: ${palette.tartOrange};
      border-top-width: 1px;
    `}
`;

const SSentMessageTopCornerInner = styled(SReceivedMessageTopCornerInner)<any>`
  border-top-left-radius: 30px;
  border-top-right-radius: 0;

  ${(props) =>
    props.isAlarmActive &&
    css`
      border-style: solid;
      border-right-color: transparent;
      border-left-color: ${palette.tartOrange};
      border-top-color: ${palette.tartOrange};
      border-top-width: 1px;
      margin-right: 0;
      border-right-width: 0;
    `}
`;

const SSenderNameContainer = styled.div<any>`
  display: flex;
  flex-direction: row;
  margin-top: 0;
  max-width: 50vw;

  margin-left: ${(props) =>
    (props.toContainerAlarm || props.isLocationMessage) && '0.75rem'};
  // margin-bottom: ${(props) => props.isLocationMessage && '0.75rem'};
  margin-right: ${(props) => props.toContainerAlarm && '1.5rem'};
`;

const SSenderName = styled.p`
  font-family: 'Roboto-Medium';
  font-size: 16px;
  font-weight: 500;
  color: ${palette.whisperGray};
  flex-shrink: 1;
  margin-bottom: 4px;
`;

const SAdditionalInfo = styled.p<any>`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  font-weight: 400;
  color: ${palette.silver};
  flex-shrink: 1;
`;

const SMessageContainer = styled.div<any>`
  position: relative;
  background-color: ${palette.cloudBurst};
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  max-width: calc(100% - 42px);
  min-height: 3rem;

  ${(props) =>
    props.sentMessage &&
    css`
      background-color: ${palette.charcoal2};
      border-top-right-radius: 0;
      border-top-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      max-width: calc(100% - 1rem);
    `}
  ${(props) =>
    props.messageContainerRounded &&
    css`
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
      margin-right: 5px;
    `}
    ${(props) =>
    props.imageContainer &&
    css`
      width: 20rem;
      padding: 0.5rem 1.5rem 1.5rem 0.75rem;
      justify-content: flex-end;
      max-width: 75vw;
    `}
    ${(props) =>
    props.alarmContainer &&
    css`
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      padding: 0.5rem 0 0;
    `}
    ${(props) =>
    props.locationContainer &&
    css`
      padding: 0.5rem 0 0;
    `}
    ${(props) =>
    props.recalledContainer &&
    css`
      background-color: ${palette.stormGray};
    `}
    ${(props) =>
    props.activeAlertContainer &&
    css`
      border: 1px solid ${palette.tartOrange};
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
    `}
    ${(props) =>
    props.canceledAlertContainer &&
    css`
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
    `};
`;

const SForwarded = styled.div<any>`
  display: flex;
  flex-direction: row;
  min-width: 90px;
  align-items: center;
  justify-content: flex-start;

  padding-left: ${(props) => props.extraForwardPadding && '12px'};

  p {
    margin-left: 6px;
    font-style: italic;
    font-weight: 400;
    font-size: 12px;
    font-family: 'Roboto-Regular';
  }
`;

const SEditMessageButtonContainer = styled.div<any>`
  z-index: 1;
  margin-top: ${(props) => props.margin && '4px'};
  position: absolute;
  right: 3px;
  top: 0;
`;

const SSentMessageDateContainer = styled.div<any>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 0.4rem 0.3rem 0;
  color: ${palette.white};
  position: absolute;
  right: 0;
  bottom: 2px;
`;

const Time = styled.p<any>`
  font-family: 'Roboto-Medium';
  font-size: 10px;
  font-weight: 500;
  color: ${palette.silver};
  align-self: flex-end;
`;

const SDots = styled.img`
  cursor: pointer;
  float: right;
  padding-top: 0.5rem;
  padding-right: 0.2rem;
`;

export default MessageContainer;
