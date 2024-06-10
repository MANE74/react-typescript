import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RecipientButton } from '../../components/RecipientButton/RecipientButton';
import {
  removeSelectedOrgAction,
  sendBroadcastMsg,
} from './broadcastSlice/actionCreators';
import { getSelectedOrgs } from './broadcastSlice';
import useForm from '../../utils/customHooks/useForm';
import Add from '../../assets/imgs/general/black-add-icon.svg';
import Pencil from '../../assets/imgs/general/pencil-icon.svg';
import { translate } from '../../utils/translate';
import ChatBox from '../../components/Chat/ChatBox';
import { saveDocumentToServer } from '../../apis/mediaAPI';
import { CreateMessageModel } from '../Chat/Chat';
import { Page } from '../../components/Page/Page';
import Loader from '../../components/Loader/Loader';
import { createMessageIsLoading, setIsLoading } from '../CreateMessage/createMessageSlice';

export interface BroadcastMsgForm {
  subject: string;
  message: string;
}

const BroadcastNew = (props: {
  setShowBottomTabs: React.Dispatch<React.SetStateAction<boolean>>;
  removeSelectedOrgAction: any;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedOrgs = useAppSelector(getSelectedOrgs);
  const isLoading = useAppSelector(createMessageIsLoading);
  const [tabBar, setTabBar] = useState(false);

  const subjectRef = useRef<HTMLInputElement>(null);

  const { inputs, handleChange, errors, handleBlur, touched, isValid } =
    useForm<BroadcastMsgForm>({
      initial: {
        subject: '',
        message: '',
      },
      validateSchema: {},
    });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleChange(e as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    dispatch(setIsLoading(false))
    if (selectedOrgs.length === 0) {
      navigate('/broadcast');
    }
  }, [selectedOrgs]);

  const onRemoveOrg = (id: number) => {
    props.removeSelectedOrgAction(id);
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

  const sendMessage = async (
    text: string | undefined,
    imageFileNames?: string[],
    documentFileNames?: string[],
    audioFileNames = [],
    locationId?: number
  ) => {
    const message: CreateMessageModel = {
      subject: inputs?.subject === '' ? null : inputs?.subject,
      documentFileNames: documentFileNames,
      audioFileNames: audioFileNames,
      photoFileNames: imageFileNames,
      text: text,
      locationId: locationId,
      subOrganizationID: _.head(selectedOrgs)?.id,
      organizationIds: selectedOrgs.map(e=>e.id),
      Type: 0,
    };
    dispatch(sendBroadcastMsg(message, navigate));
  };

  const highlightText = () => {
    if (subjectRef.current) subjectRef.current.focus();
  };
  
  if (isLoading) return <Loader />

  return (
    <SPage>
      <BroadcastView>
        <GroupContainer>
          <Link to="/broadcast">
            <AddGroupButton>
              <img src={Add} alt="addGroup" />
            </AddGroupButton>
          </Link>

          {_.map(selectedOrgs, (org) => {
            return (
              <RecipientButton
                key={org.id}
                name={org.name}
                onClick={() => onRemoveOrg(org.id)}
              />
            );
          })}
        </GroupContainer>

        <SubjectContainer>
          <SubjectLabel>{translate('messages_subject_add')}</SubjectLabel>

          <SubjectInput
            type="text"
            name="subject"
            value={inputs.subject}
            placeholder={
              translate('messages_subject_add_placeholder') as string
            }
            onChange={onChange}
            onBlur={handleBlur}
            ref={subjectRef}
          />

          <SubjectIcon onClick={highlightText}>
            <img src={Pencil} alt="addGroup" />
          </SubjectIcon>
        </SubjectContainer>
      </BroadcastView>

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
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    removeSelectedOrgAction: (id: number) =>
      dispatch(removeSelectedOrgAction(id)),
  };
};

export default connect(null, mapDispatchToProps)(BroadcastNew);

const SPage = styled(Page)`
  padding: 1.25rem 0 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const BroadcastView = styled.div`
  padding: 0 1.25rem;

  min-height: 0;
  height: 100%;

  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const AddGroupButton = styled.div`
  height: 36px;
  width: 36px;
  padding: 11px 11px;
  border-radius: 50px;
  background-color: ${palette.honeyYellow};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-right: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const SubjectContainer = styled.form`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid;
  border-top: 1px solid;
  border-color: ${(props) => palette.queenBlue};
`;

const SubjectLabel = styled.div`
  font-size: 14px;
`;

const SubjectInput = styled.input`
  flex: 1;
  font-size: 14px;
  height: 45px;
  border: none;
  padding: 25px 30px;
  color: ${(props) => palette.white};
  background-color: transparent;
  :focus {
    outline: none;
  }
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px ${palette.raisinBlack} inset;
    -webkit-text-fill-color: ${palette.white};
  }
`;

const SubjectIcon = styled.span`
  cursor: text;
  position: absolute;
  top: 50%;
  right: 5px;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
`;
