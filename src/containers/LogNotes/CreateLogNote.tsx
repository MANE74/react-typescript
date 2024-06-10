import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { saveDocumentToServer } from '../../apis/mediaAPI';
import ChatBox from '../../components/Chat/ChatBox';
import { SimpleText } from '../../components/Chat/ChatListItem.styles';
import { Page } from '../../components/Page/Page';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { CreateMessageModel } from '../Chat/Chat';
import { sendAMessage } from '../CreateMessage/createMessageSlice/actionCreators';
import {
  SIcon,
  SInput,
  SItem,
  SLine,
} from '../CreateMessage/CreateMessageSummary';
import { selectUser } from '../Login/LoginSlice';
import Pencil from '../../assets/imgs/chats/edit-yellow.svg';
import { translate } from '../../utils/translate';

function CreateLogNote() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const [tabBar, setTabBar] = useState(true);
  const [subjectText, setSubjectText] = useState('');
  const subjectRef = useRef<HTMLInputElement>(null);

  const sendMessage = (
    text?: string,
    imageFileNames?: string[],
    documentFileNames?: string[],
    audioFileNames = [],
    locationId?: number
  ) => {
    const messageModel: CreateMessageModel = {
      subject: subjectText === '' ? null : subjectText,
      senderId: user?.id,
      groupIds: [],
      recipientIds: [],
      documentFileNames: documentFileNames,
      audioFileNames: audioFileNames,
      photoFileNames: imageFileNames,
      text: text,
      locationId: locationId,
      type: 10,
    };

    dispatch(sendAMessage(messageModel, navigate, true));
  };

  const onPhotosSend = async (imagesList: string[], messageText: string) => {
    if (imagesList.length > 0) {
      const text =
        messageText && messageText.length > 0 ? messageText : undefined;
      sendMessage(text, imagesList);
    }
  };

  const onDocumentsSend = async (documentsList: File[]) => {
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
    if (documentsFilesNamesArray.length > 0) {
      sendMessage(undefined, [], documentsFilesNamesArray);
    }
  };

  const handleSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectText(e.target.value);
  };
  const highlightText = () => {
    if (subjectRef.current) subjectRef.current.focus();
  };

  return (
    <SPage>
      <SCreateLogNote>
        <SItem className="input">
          <SimpleText className="left" fontSize="12px">
            {translate(`messages_subject_add`)}
          </SimpleText>
          <SInput
            onChange={handleSubject}
            value={subjectText}
            type="text"
            placeholder={translate(`messages_subject_add_placeholder`)}
            ref={subjectRef}
          />

          <SIcon
            src={Pencil}
            alt=""
            onClick={highlightText}
            className="pencil"
          />
        </SItem>
        <SLine />
      </SCreateLogNote>
      <ChatBox
        tabBar={tabBar}
        setTabBar={setTabBar}
        onTextSend={sendMessage}
        onPhotosSend={onPhotosSend}
        onDocumentsSend={onDocumentsSend}
        onLocationSend={(locationId, text) =>
          sendMessage(text, [], [], [], locationId)
        }
      />
    </SPage>
  );
}

export default CreateLogNote;

const SPage = styled(Page)`
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0 0 0;
`;

const SCreateLogNote = styled.div`
  height: 100%;
  padding: 0 1.25rem;
`;
