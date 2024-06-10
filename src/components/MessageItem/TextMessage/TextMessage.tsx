import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { palette } from '../../../theme/colors';
import { MessageType } from '../../../utils/enums';
import MessageContainer from '../../MessageContainer/MessageContainer';
import { decode } from 'html-entities';

export interface TextMessageProps {
  messageText: string;
  sentDateTime: string;
  isSent: boolean;
  senderImage: string | null;
  senderName: string;
  isSameSender?: boolean;
  emergencyRecall?: boolean;
  messageTo: string | null;
  subject: string | null;
  toggleModal?: () => void;
  emergencyTypeName?: string;
  hideMenu: boolean;
  showOnlyAttachment?: boolean;
  forwarded?: boolean;
  edited?: boolean;
}

function TextMessage(props: TextMessageProps) {
  const {
    messageText,
    sentDateTime,
    isSent,
    senderImage,
    senderName,
    emergencyRecall,
    messageTo,
    subject,
    toggleModal,
    emergencyTypeName,
    showOnlyAttachment = false,
    forwarded,
    edited,
  } = props;

  const { t } = useTranslation();

  const messageType = isSent
    ? MessageType.SentTextMessage
    : MessageType.ReceivedTextMessage;

  return (
    <MessageContainer
      messageType={messageType}
      sentDateTime={sentDateTime}
      senderImage={senderImage}
      senderName={senderName}
      emergencyRecall={emergencyRecall}
      messageTo={messageTo}
      subject={subject}
      toggleModal={toggleModal}
      showOnlyAttachment={showOnlyAttachment}
      forwarded={forwarded}
      edited={edited}
    >
      <>
        {!emergencyRecall && (
          <SMessageText margin>{decode(messageText)}</SMessageText>
        )}
        {emergencyRecall && (
          <div>
            <SMessageText>
              {emergencyTypeName + t(`messages_recall`)}
            </SMessageText>
            <SSenderText>{senderName}</SSenderText>
          </div>
        )}
      </>
    </MessageContainer>
  );
}

export const SMessageText = styled.p<any>`
  padding-right: 4px;
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  margin-bottom: ${(props) => props.margin && '6px'};

  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
`;

const SSenderText = styled.p`
  color: ${palette.honeyYellow};
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
`;

export default TextMessage;
