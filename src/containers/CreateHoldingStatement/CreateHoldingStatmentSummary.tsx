import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../../components/Chat/ChatBox';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { saveDocumentToServer } from '../../apis/mediaAPI';
import { sendAMessage } from '../CreateMessage/createMessageSlice/actionCreators';
import Pencil from '../../assets/imgs/iamokay/iamok-pencil.svg';
import styled from 'styled-components';
import {
  SIcon,
  SInput,
  SItem,
  SSimpleText,
} from '../StartOnCallAlertMessage/styles';
import { translate } from '../../utils/translate';
import { useCreateHoldingStatementCtx } from './CreateHoldingStatementContext';
import { palette } from '../../theme/colors';
import { SSummaryTab } from '../StartOnCallAlertMessage/StartOnCallAlertMessageSummary';
import { getRecipantsText } from '../StartOnCallAlertMessage/helpers';
import {
  MessageSubjectForm,
  messageSubjectSchema,
  useMembersWitPic,
} from './helpers';
import { HorizontalScrollSummaryList } from '../../components/HorizontalScrollSummaryList/HorizontalScrollSummaryList';
import {
  selectGroupsByIds,
  selectGroupsIDList,
} from '../GroupsList/groupsSlice';
import { CreateMessageModel } from '../Chat/Chat';
import { selectUser } from '../Login/LoginSlice';
import {
  FilterOrSelectBottomSheet,
  SelectedAllType,
} from '../../components/FilterOrSelectBottomSheet/FilterOrSelectBottomSheet';
import Loader from '../../components/Loader/Loader';
import useForm from '../../utils/customHooks/useForm';

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SHorizontalScrollSummaryList = styled(HorizontalScrollSummaryList)`
  width: 90%;
  margin: 0 auto 0 auto;
`;

const SSSummaryTab = styled(SSummaryTab)`
  width: 90%;
  margin: 0 auto 0 auto;
`;

export const SsItem = styled(SItem)`
  width: 90%;
  margin: 0 auto 0 auto;
`;

const SGrowDiv = styled.div`
  flex-grow: 1;
`;

export const CreateHoldingStatmentSummary = () => {
  const [tabBar, setTabBar] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [recipientsFilter, setRecipientsFilter] = React.useState(false);
  const subjectRef = React.useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    groupIds,
    setGroupIds,
    subject,
    setSubject,
    onFinish,
    messageText: text,
    setMessageText: setText,
    userIds,
    setUserIds,
  } = useCreateHoldingStatementCtx();

  const groups = useAppSelector(selectGroupsByIds([...groupIds]));
  const user = useAppSelector(selectUser);

  React.useEffect(() => {
    if (groupIds.size === 0) {
      goToSelectGroups();
      return;
    }
  }, [groupIds]);

  let mounted = true;
  React.useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
    };
  }, []);

  const { members: membersForFilter, isGettingMembers } = useMembersWitPic({
    ids: [...groupIds],
    setUserIds: setUserIds,
  });
  const { inputs, handleChange, errors, handleBlur, touched, setErrors } =
    useForm<MessageSubjectForm>({
      initial: {
        subject: '',
      },
      validateSchema: {
        subject: messageSubjectSchema,
      },
    });

  const handleSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const focusSubject = () => {
    if (!inputs.subject) {
      if (mounted) setErrors({ ...touched, subject: 'error' });
    }
  };
  const sendMessage = async (
    text?: string,
    imageFileNames?: string[],
    documentFileNames?: string[],
    audioFileNames = [],
    locationId?: number
  ) => {
    setIsLoading(true);

    const messageModel: CreateMessageModel = {
      subject: inputs.subject,
      senderId: user?.id,
      groupIds: [...groupIds],
      recipientIds: [...userIds],
      documentFileNames: documentFileNames,
      audioFileNames: audioFileNames,
      photoFileNames: imageFileNames,
      text: text,
      locationId: locationId,
      type: 9,
    };

    await dispatch(sendAMessage(messageModel, navigate, undefined, true));
    setIsLoading(false);
  };

  const onPhotosSend = async (imagesList: string[], messageText: string) => {
    setIsLoading(true);
    if (imagesList.length > 0) {
      const text =
        messageText && messageText.length > 0 ? messageText : undefined;
      sendMessage(text, imagesList);
    }
    setIsLoading(false);
  };

  const onDocumentsSend = async (documentsList: File[]) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const onLocationSend = (locationId: number, text?: string | undefined) => {
    sendMessage(text, [], [], [], locationId);
  };

  const goToSelectGroups = () => {
    navigate('/createHoldingStatement');
  };
  const deleteContact = (id: number) => {
    setGroupIds(prev => {
      const filterdSet = new Set(prev);
      filterdSet.delete(id);
      if (filterdSet.size === 0) {
        goToSelectGroups();
      }
      return filterdSet;
    });
  };

  const onFilter = (selected: Set<number> | SelectedAllType) => {
    switch (selected) {
      case 'SELECTED_ALL':
        const _selected = new Set(
          membersForFilter.map(member => member.userID!)
        );
        setUserIds(_selected);
        setRecipientsFilter(false);
        break;
      case 'UNSELECTED_ALL':
        break;
      default:
        setUserIds(selected);
        setRecipientsFilter(false);
        break;
    }
  };

  const highlightText = () => {
    if (subjectRef.current) subjectRef.current.focus();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e as React.ChangeEvent<HTMLInputElement>);

  const isSubjectValid = !errors.subject;

  if (isLoading) return <Loader />;
  return (
    <SContainer>
      {!isGettingMembers && (
        <FilterOrSelectBottomSheet
          isOpen={recipientsFilter}
          setIsOpen={setRecipientsFilter}
          onFilter={onFilter}
          data={membersForFilter}
          initialSelected={userIds}
          withPhoto
          atLeastOneReq
          selectShapeType="box"
          titleTx="messages_selectRecepients"
          selectAllTx={'imOk_allRecepients'}
          atLeastOneReqTx="message_create_selectAtLeastOneGroup"
          hideCurrentUserId={user?.id}
        />
      )}
      <SHorizontalScrollSummaryList
        data={groups}
        onAddButtonClick={goToSelectGroups}
        omSummaryClick={goToSelectGroups}
        OnDeleteItem={deleteContact}
      />
      <SSSummaryTab
        title={translate('recepients')! + ':'}
        summaryText={getRecipantsText(membersForFilter, userIds || new Set())}
        onTabClick={() => setRecipientsFilter(true)}
      />
      <SsItem className="input">
        <SSimpleText className="left" fontSize="12px">
          {translate(`messages_subject_add`)}
        </SSimpleText>
        <SInput
          name="subject"
          value={inputs.subject}
          onChange={onChange}
          onBlur={handleBlur}
          $error={!!errors.subject}
          type="text"
          placeholder={translate(`messages_subject_add_placeholder`)!}
          ref={subjectRef}
        />

        <SIcon src={Pencil} alt="" onClick={highlightText} />
      </SsItem>
      <SGrowDiv />
      <ChatBox
        tabBar={tabBar}
        setTabBar={setTabBar}
        onTextSend={sendMessage}
        onPhotosSend={onPhotosSend}
        onDocumentsSend={onDocumentsSend}
        onLocationSend={onLocationSend}
        //
        dependencyRequired
        isDependencyAdded={!!inputs.subject}
        onDependencyReFocus={focusSubject}
      />
    </SContainer>
  );
};
