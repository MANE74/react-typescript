import React from 'react';
import { Reply } from '../../../containers/ChatsList/chatListSlice/types';
import { dateFormats, getDateFormatCustom } from '../../../utils/date';
import { SMessageDateSeparator } from '../MessageItem';
import TextMessage from '../TextMessage/TextMessage';

import AudioMessage from '../AudioMessage/AudioMessage';
import _ from 'lodash';
import FileMessage from '../FileMessage/FileMessage';
import ImageMessage from '../ImageMessage/ImageMessage';
import LocationMessage from '../LocationMessage.tsx/LocationMessage';

interface ChatReplyProps {
  reply: Reply;
  userId: number;
  isSameDay: boolean;
  isSameSender: boolean;
  emergencyTypeName: string | null;
  setShowBottomTabs: React.Dispatch<React.SetStateAction<boolean>>;
  onPlayClick: (id: number | null) => void;
  isAudioActive: boolean;
  toggleOptions: () => void;
  onMapClick: (
    longitude: number,
    latitude: number,
    address: string,
    date: string,
    isAlarm: boolean
  ) => void;
  showOnlyAttachment?: boolean;
}

function ChatReply(props: ChatReplyProps) {
  const {
    reply,
    userId,
    isSameDay,
    isSameSender,
    emergencyTypeName,
    onPlayClick,
    isAudioActive,
    toggleOptions,
    onMapClick,
    showOnlyAttachment = false,
  } = props;

  return (
    <>
      {!isSameDay && !showOnlyAttachment && (
        <SMessageDateSeparator>
          {getDateFormatCustom(reply.sent, dateFormats.mothNamePlusDate)}
        </SMessageDateSeparator>
      )}
      {reply.locationID && (
        <LocationMessage
          text={!showOnlyAttachment ? reply.text : ''}
          isSent={reply.senderID === userId}
          sentDateTime={getDateFormatCustom(reply.sent, dateFormats.simpleTime)}
          isSameSender={isSameSender}
          senderName={reply.senderName}
          locationId={reply.locationID}
          senderImage={reply.photoFileName!}
          toggleModal={toggleOptions}
          onMapClick={(lat, lng, address) => {
            onMapClick(
              lat,
              lng,
              address,
              getDateFormatCustom(
                reply.sent,
                dateFormats.yearMonthDayTimeNoComma24
              ),
              false
            );
          }}
          showOnlyAttachment={showOnlyAttachment}
          messageTo={null}
          subject={null}
          edited={reply.edited}
        />
      )}
      {reply.photoFileNames?.length === 0 &&
        reply.documentFileNames?.length === 0 &&
        !reply.locationID &&
        !showOnlyAttachment &&
        reply.text && (
          <TextMessage
            isSent={reply.senderID === userId}
            key={`text${reply.id}`}
            sentDateTime={getDateFormatCustom(
              reply.sent,
              dateFormats.simpleTime
            )}
            messageText={reply.text}
            isSameSender={isSameSender}
            senderName={reply.senderName}
            emergencyRecall={reply.emergencyRecall}
            emergencyTypeName={emergencyTypeName!}
            senderImage={reply.photoFileName!}
            toggleModal={toggleOptions}
            hideMenu={false}
            showOnlyAttachment={showOnlyAttachment}
            messageTo={null}
            subject={null}
            edited={reply.edited}
          />
        )}
      {reply.photoFileNames?.length !== 0 && (
        <ImageMessage
          photoFileNames={reply.photoFileNames!}
          senderName={reply.senderName}
          isSameSender={isSameSender}
          senderImage={reply.photoFileName!}
          isSent={reply.senderID === userId}
          sentDateTime={getDateFormatCustom(reply.sent, dateFormats.simpleTime)}
          messageText={!showOnlyAttachment ? reply.text : ''}
          toggleModal={toggleOptions}
          showOnlyAttachment={showOnlyAttachment}
          messageTo={null}
          subject={null}
          edited={reply.edited}
        />
      )}
      {!_.isEmpty(reply.documentFileNames) && (
        <FileMessage
          key={`file${reply.id}`}
          text={!showOnlyAttachment ? reply.text : ''}
          documents={reply.attachments || []}
          senderName={reply.senderName}
          senderImage={reply.photoFileName!}
          isSameSender={isSameSender}
          isSent={reply.senderID === userId}
          sentDateTime={getDateFormatCustom(reply.sent, dateFormats.simpleTime)}
          toggleModal={toggleOptions}
          showOnlyAttachment={showOnlyAttachment}
          messageTo={null}
          subject={null}
          edited={reply.edited}
        />
      )}
      {_.map(reply.audioFileNames, (document, index) => (
        <AudioMessage
          messageId={reply.id}
          key={`audio${reply.id}-${index}`}
          isSent={reply.senderID === userId}
          sentDateTime={getDateFormatCustom(reply.sent, dateFormats.simpleTime)}
          senderImage={reply.photoFileName!}
          isSameSender={isSameSender}
          audioFile={document}
          isAudioActive={isAudioActive}
          senderName={reply.senderName}
          onPlayClick={onPlayClick}
          toggleModal={toggleOptions}
          showOnlyAttachment={showOnlyAttachment}
          messageTo={null}
          subject={null}
          edited={reply.edited}
        />
      ))}
    </>
  );
}

export default ChatReply;
