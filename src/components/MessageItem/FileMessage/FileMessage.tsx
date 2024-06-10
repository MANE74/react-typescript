import React from 'react';
import styled from 'styled-components';
import { MessageType } from '../../../utils/enums';
import MessageContainer from '../../MessageContainer/MessageContainer';
import { SMessageText } from '../TextMessage/TextMessage';
import PaperClip from '../../../assets/imgs/chats/paper-clip.svg';
import { palette } from '../../../theme/colors';
import { decode } from 'html-entities';
import { Attachment } from '../../../containers/ChatsList/chatListSlice/types';
import { formatBytes } from '../../../utils/formatBytes';

export interface FileMessageProps {
  text: string;
  documents: Attachment[];
  isSent: boolean;
  sentDateTime?: string;
  senderImage: string | null;
  senderName: string;
  isSameSender?: boolean;
  messageTo: string | null;
  subject: string | null;
  toggleModal?: () => void;
  showOnlyAttachment?: boolean;
  forwarded?: boolean;
  edited?: boolean;
}

function FileMessage(props: FileMessageProps) {
  const {
    text,
    subject,
    toggleModal,
    documents,
    isSent,
    sentDateTime,
    senderImage,
    senderName,
    isSameSender = false,
    messageTo,
    showOnlyAttachment = false,
    forwarded,
    edited,
  } = props;

  const messageType = isSent
    ? MessageType.SentFileMessage
    : MessageType.ReceivedFileMessage;

  return (
    <MessageContainer
      messageType={messageType}
      sentDateTime={sentDateTime}
      senderImage={senderImage}
      senderName={senderName}
      messageTo={messageTo}
      toggleModal={toggleModal}
      isSameSender={isSameSender}
      showOnlyAttachment={showOnlyAttachment}
      subject={subject}
      forwarded={forwarded}
      edited={edited}
    >
      <div>
        {text && <SDescription>{decode(text)}</SDescription>}
        {documents.map((doc, key) => (
          <>
            <SPdfContainer
              key={key}
              href={`${process.env.REACT_APP_API_URL}/api/media/file/${doc.fileName}`}
              target="_blank"
            >
              <SMessageText>{doc.fileName}</SMessageText>
              <img src={PaperClip} alt="" width={12} />
            </SPdfContainer>
            <SpdfSizeText>
              {doc.fileSize ? formatBytes(doc.fileSize) : ''}
            </SpdfSizeText>
          </>
        ))}
      </div>
    </MessageContainer>
  );
}

export const SDescription = styled.p`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  padding-bottom: 0.75rem;
  padding-top: 4px;
`;

const SpdfSizeText = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 12px;
  padding-top: 2px;
`;

const SPdfContainer = styled.a`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  color: ${palette.white};
  text-decoration: none;
`;

export default FileMessage;
