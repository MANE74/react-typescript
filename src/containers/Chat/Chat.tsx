import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import Loader from '../../components/Loader/Loader';
import { MessageItem } from '../../components/MessageItem/MessageItem';
import Options, { OptionItemProps } from '../../components/Options/Options';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  AlarmTypes,
  CreateMessageReplyType,
  ReceivedMessageType,
  SentMessageType,
} from '../../utils/enums';
import { isChatsLoading, selectCurrentChat } from '../ChatsList/chatListSlice';
import {
  deleteAReply,
  editMessageAction,
  fetchCurrentChat,
  replyToMessageAction,
} from '../ChatsList/chatListSlice/actionCreators';

import ChatBox from '../../components/Chat/ChatBox';
import { setForwardedMessage } from '../CreateMessage/createMessageSlice';
import { Chat as ChatType, Reply } from '../ChatsList/chatListSlice/types';

import Pencil from '../../assets/imgs/chats/edit-white.svg';
import Copy from '../../assets/imgs/chats/copy.svg';
import Delete from '../../assets/imgs/chats/delete.svg';
import Forward from '../../assets/imgs/chats/forward.svg';
import ChatReply from '../../components/MessageItem/ChatReply/ChatReply';
import GreenCheck from '../../assets/imgs/chats/green-check.svg';
import { selectUser } from '../Login/LoginSlice';
import { Modal } from '../../components/Modal/Modal';
import MapModal from '../../components/MapModal/MapModal';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { saveDocumentToServer } from '../../apis/mediaAPI';
import { ChatScreenTopBar } from '../../components/ChatScreenTopBar/ChatScreenTopBar';
import CallAlertPhone from '../../assets/imgs/onCallAlert/on-call-alert-phone.svg';
import { ActionButton } from '../../components/ActionButtons/ActionButtons.style';
import _ from 'lodash';
import { ForwardMessageModel } from '../CreateMessage/createMessageSlice/types';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { getMessageHeaderSubTitle } from './helpers';

export interface ChatProps {
  id?: string;
  setIsAlarmActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubMessage?: boolean;
  fromHoldingStatment?: boolean;
}

export interface MessageReplyModel {
  messageId: number;
  text?: string;
  photoFileNames?: string[];
  audioFileNames?: string[];
  documentFileNames?: string[];
  locationId?: number;
}

export interface CreateMessageModel {
  id?: number;
  senderId?: number;
  text: string | undefined;
  photoFileNames?: string[];
  documentFileNames?: string[];
  audioFileNames?: string[];
  groupIds?: number[];
  recipientIds?: number[] | null;
  emergencyTypeId?: number;
  subOrganisationIDForEmergencyMessage?: number;
  locationId?: number;
  type?: number;
  replyType?: number;
  subject?: string | null;
  organizationID?: number;
  subOrganizationID?: number;
  Type?: number;
  organizationIds?: Array<number> | null;
}

export const Chat = (props: ChatProps) => {
  const {
    id,
    setIsAlarmActive,
    fromHoldingStatment = false,
    setSubMessage,
  } = props;

  const message: ChatType | undefined = useAppSelector(selectCurrentChat);
  const loading = useAppSelector(isChatsLoading);
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setMessage, setSubTitle } = useLayoutContext();

  const [activeAudio, setActiveAudio] = useState<number | null>(null);
  const [showBottomTabs, setShowBottomTabs] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatType | Reply | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<string>(Copy);
  const [editText, setEditText] = useState<string | undefined>(undefined);
  const [mapModalOpen, setMapModalOpen] = useState({
    open: false,
    isAlarm: false,
  });
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [message?.repliesCount]);

  useEffect(() => {
    // @ts-ignore
    if (message && location.state?.fromDetails) {
      handleMessageHeader(message);
      return;
    }
    dispatch(fetchCurrentChat(id!));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    var interval: NodeJS.Timeout | undefined = undefined;

    const getUnread = () => {
      dispatch(fetchCurrentChat(id!, true));
    };
    if (user) {
      interval = setInterval(getUnread, 15000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  const handleMessageHeader = (message: ChatType) => {
    let subText = '';
    if (message.type === 2 && !message.recalled) {
      setIsAlarmActive && setIsAlarmActive(true);
      if (message.emergencyTypeName !== null) {
        setMessage(message.emergencyTypeName);
      } else {
        setMessage(t(`coalert_messages_title`));
      }
    } else {
      setIsAlarmActive && setIsAlarmActive(false);
      if (message.subject) {
        setMessage(message.subject);
      } else {
        setMessage('groups_message');
      }
    }
    if (isIamOkMessage) {
      setMessage(t('home_muster'));
    }
    if (isOnCallAlerMessage) {
      setMessage(t('onCallAlert_screen'));
    }
    if (message?.type === 10) {
      setMessage(t('logNote'));
    }
    if (
      _.isEqual(message?.type, ReceivedMessageType.Broadcast) &&
      (_.isNil(message.subject) || _.isEmpty(message.subject))
    ) {
      setMessage(t('broadcast'));
    }
    // [TODO] need to review this code when a clear specifcation comes from the client

    subText = getMessageHeaderSubTitle(message, t);
    setSubMessage && setSubTitle(subText);
  };

  useLayoutEffect(() => {
    if (message) {
      handleMessageHeader(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, location.key]);

  const copyText = () => {
    if (selectedChat?.text) {
      navigator.clipboard.writeText(selectedChat?.text);
      setCopyState(GreenCheck);

      setTimeout(() => {
        setSelectedChat(null);
        setOptionsOpen(false);
        setCopyState(Copy);
      }, 1500);
    }
  };

  const forward = () => {
    if (!selectedChat) return;
    const model: ForwardMessageModel = {
      text: selectedChat.text,
      photoFileNames: selectedChat.photoFileNames || [],
      documentFileNames: selectedChat.documentFileNames || [],
      locationID: selectedChat.locationID || undefined,
      audioFileNames: selectedChat.audioFileNames,
    };

    dispatch(setForwardedMessage(model));
    navigate('forward');
  };

  const deleteReply = () => {
    if (message && selectedChat) {
      setOptionsOpen(false);
      dispatch(deleteAReply(message.id, selectedChat.id));
      setSelectedChat(null);
    }
  };

  const editMessage = () => {
    if (message && selectedChat) {
      setEditText(selectedChat.text);
      setOptionsOpen(false);
    }
  };
  const isAllowToReply =
    message?.replyType !== CreateMessageReplyType.noReply &&
    message?.type !== ReceivedMessageType.Broadcast;
  const isHoldingStatmentMessage =
    message?.type === SentMessageType.HoldingStatement;
  const canHoldingStatmnetInteract = isHoldingStatmentMessage
    ? fromHoldingStatment
    : true;

  const isIamOkMessage = !!message?.musterID;
  const isOnCallAlerMessage = !!message?.onCallAlertID;
  const isSender = selectedChat?.senderID === user?.id;
  const isReply =
    // @ts-ignore
    selectedChat?.replies === undefined;

  const canDelete = isReply && isSender;
  const canEdit =
    isSender &&
    // @ts-ignore
    (!(isReply && selectedChat.emergencyRecall === true) ||
      // @ts-ignore
      !(!isReply && selectedChat.type === 3)) &&
    canHoldingStatmnetInteract;

  const options: OptionItemProps[] = [
    {
      id: 1,
      name: 'forward_message_text',
      icon: Forward,
      callback: forward,
    },
    {
      id: 2,
      name: 'messages_edit',
      icon: Pencil,
      callback: editMessage,
    },
    {
      id: 3,
      name: 'messages_copy',
      icon: copyState,
      callback: copyText,
    },
    {
      id: 4,
      name: 'messages_delete',
      icon: Delete,
      callback: deleteReply,
    },
  ];
  const optionsToShow = () => {
    const hasText = !_.isEmpty(selectedChat?.text);
    let returnOptions = [...options];
    if (!canDelete) {
      returnOptions.pop();
    }
    if (!hasText) {
      const idx = returnOptions.findIndex((item) => item.id === 3);
      returnOptions.splice(idx, 1);
    }
    if (!canEdit) {
      const idx = returnOptions.findIndex((item) => item.id === 2);
      returnOptions.splice(idx, 1);
    }
    if(message?.type === 3){
      const idx = returnOptions.findIndex((item) => item.id === 2);
      returnOptions.splice(idx, 1)
    }
    return returnOptions;
  };

  const getAlertType = (emergencyTypeName: string) => {
    switch (emergencyTypeName) {
      case 'Feeling ill':
        return AlarmTypes.FeelingIll;
      case 'Scared':
        return AlarmTypes.Scared;
      case 'Crime in progress':
        return AlarmTypes.Crime;
      case 'Fire':
        return AlarmTypes.Fire;
      default:
        return null;
    }
  };

  const playAudio = (id: number | null) => {
    setActiveAudio(id);
  };

  const editChatMessage = (text: string, reply: boolean) => {
    if (!reply) {
      dispatch(editMessageAction(text, message?.id!));
    } else {
      dispatch(editMessageAction(text, message?.id!, selectedChat?.id));
    }
    setSelectedChat(null);
    setEditText(undefined);
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

  const replyToChatMessage = (
    textMessage?: string,
    photoFiles: string[] = [],
    documentFiles: string[] = [],
    audioFiles: string[] = [],
    locationId?: number
  ) => {
    if (message) {
      const messageModel: MessageReplyModel = {
        messageId: message.id,
        text: textMessage,
        photoFileNames: photoFiles,
        audioFileNames: audioFiles,
        documentFileNames: documentFiles,
        locationId: locationId,
      };
      dispatch(replyToMessageAction(messageModel));
    }
  };

  const onPhotosSend = async (imagesList: string[], messageText: string) => {
    if (imagesList.length > 0) {
      const text =
        messageText && messageText.length > 0 ? messageText : undefined;
      replyToChatMessage(text, imagesList);
    }
  };

  const onDocumentsSend = async (
    documentsList: File[],
    messageText: string
  ) => {
    const documentsFilesNamesArray = [];
    let document: File;
    for await (document of documentsList) {
      const formData = new FormData();
      formData.append('document', document);
      const result = await saveDocumentToServer(formData);
      if (result) {
        documentsFilesNamesArray.push(result);
      }
    }
    const text =
      messageText && messageText.length > 0 ? messageText : undefined;
    if (documentsFilesNamesArray.length > 0) {
      replyToChatMessage(text, [], documentsFilesNamesArray);
    }
  };

  const toggleMapModal = (
    lng: number,
    lat: number,
    address: string,
    sent: string,
    isAlarm: boolean
  ) => {
    setMapState({
      latitude: lat,
      longitude: lng,
      address: address,
      sent: sent,
    });
    setMapModalOpen({ open: true, isAlarm });
  };

  const renderMapModal = (message: ChatType) => {
    if (!mapModalOpen) return <></>;

    return (
      <Modal
        isOpen={mapModalOpen.open}
        setIsOpen={() => setMapModalOpen({ open: false, isAlarm: false })}
      >
        <MapModal
          isAlarm={mapModalOpen.isAlarm}
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
                  dateFormats.mothNameShortDateTimeNoComma24
                )
          }
        />
      </Modal>
    );
  };

  if (!message || message.id !== Number(id) || loading || !user) {
    return (
      <SChat id="chat">
        <Loader />
      </SChat>
    );
  }

  return (
    <SChat id="chat">
      {isIamOkMessage && (
        <ChatScreenTopBar
          link={`/muster/${message.musterID}`}
          title={message?.ended ? t('imOk_ended') : t('imOk_updatedStatus')}
          ended={message?.ended || false}
        />
      )}

      {isOnCallAlerMessage && (
        <ChatScreenTopBar
          link={`/oncall/${message.onCallAlertID}`}
          title={
            message?.ended ? t('onCallAlert_ended') : t('imOk_updatedStatus')
          }
          ended={message?.ended || false}
          endSrc={CallAlertPhone}
        />
      )}

      {message && (
        <>
          <SChatContainer topPadding={isIamOkMessage || isOnCallAlerMessage}>
            {renderMapModal(message)}
            <Options
              items={optionsToShow()}
              isOpen={optionsOpen}
              setIsOpen={setOptionsOpen}
            />
            <MessageItem
              key={message.id}
              alert={message.type === 2}
              message={message}
              onPlayClick={playAudio}
              isAudioActive={message.id === activeAudio}
              alertType={getAlertType(message.emergencyTypeName!)!}
              toggleOptions={() => {
                setSelectedChat(message);
                setOptionsOpen(!optionsOpen);
              }}
              onMapClick={toggleMapModal}
            />
            {message.replies.map((reply: Reply, index) => {
              const thisReplyDate = getDateFormat(reply.sent);
              const thisReplySenderID = reply.senderID;
              const prevReplySenderID =
                index > 0
                  ? message.replies[index - 1].senderID
                  : message.senderID;
              const prevReplyDate =
                index > 0 && getDateFormat(message.replies[index - 1].sent);
              const messageSentDate = getDateFormat(message.sent);
              const isSameDay = prevReplyDate
                ? sameDay(prevReplyDate, thisReplyDate)
                : sameDay(messageSentDate, thisReplyDate);
              return (
                <ChatReply
                  key={reply.id}
                  reply={reply}
                  userId={user.id}
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
                />
              );
            })}
            <div ref={messagesEndRef} />
          </SChatContainer>
          {message.type === 2 && !message.recalled && (
            <ActionButton
              to="#"
              onClick={(e) => {
                window.location.href = 'tel:112';
                e.preventDefault();
              }}
              tx="messages_112"
              color="red"
              margin="1.25rem"
            />
          )}
          {canHoldingStatmnetInteract && isAllowToReply && (
            <ChatBox
              setEditText={setEditText}
              editText={editText}
              tabBar={showBottomTabs}
              setTabBar={setShowBottomTabs}
              onTextSend={
                editText
                  ? (text) => {
                      editChatMessage(text, isReply);
                    }
                  : replyToChatMessage
              }
              onPhotosSend={onPhotosSend}
              onDocumentsSend={onDocumentsSend}
              onLocationSend={(locationId, text) =>
                replyToChatMessage(text, [], [], [], locationId)
              }
            />
          )}
        </>
      )}
    </SChat>
  );
};

const SChat = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const SChatContainer = styled.div<{ topPadding?: boolean }>`
  min-height: 0;
  height: 100%;

  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 1.25rem 1.25rem;

  ${(props) =>
    props.topPadding &&
    css`
      padding-top: 3.125rem;
    `}

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
