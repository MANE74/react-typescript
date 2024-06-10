import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HorizontalScrollSummaryList } from '../../components/HorizontalScrollSummaryList/HorizontalScrollSummaryList';
import { SummaryTab } from '../../components/SummaryTab/SummaryTab';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { translate } from '../../utils/translate';
import { selectGroupById } from '../GroupsList/groupsSlice';
import { Group } from '../GroupsList/groupsSlice/types';
import { useStartIamOkMessageCtx } from './StartIamOkMessageContext';
import Pencil from '../../assets/imgs/iamokay/iamok-pencil.svg';
import { SIcon, SInput, SItem, SLine, SSimpleText } from './styles';
import { CecChatInput } from '../../components/cec/CecChatInput/CecChatInput';
import {
  FilterOrSelectBottomSheet,
  SelectedAllType,
} from '../../components/FilterOrSelectBottomSheet/FilterOrSelectBottomSheet';

import { getRecipantsText, useGetMembers } from './helpers';
import { sendIamOkMessage } from '../../apis/imOkAPI';
import { fetchImOkList } from '../ImOkList/imOkSlice/actionCreators';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import Loader from '../../components/Loader/Loader';
import { selectUser } from '../Login/LoginSlice';

const SContainer = styled.div`
  width: 90%;
  margin: auto;
`;

const SSummaryTab = styled(SummaryTab)`
  /* padding: 0.9375rem 0rem; */
  .SRightContaoner {
    width: 77%;
  }
`;

export const StartIamOkMessageSummary = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [recipientsFilter, setRecipientsFilter] = React.useState(false);

  const subjectRef = React.useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const confirm = useConfirmation();
  const user = useAppSelector(selectUser);

  const {
    groupIds,
    setGroupIds,
    subject,
    setSubject,
    onFinish,
    iamOkMessageText: text,
    setIamOkMessageText: setText,
    userIds,
    setUserIds,
  } = useStartIamOkMessageCtx();
  const { members, isGettingMembers } = useGetMembers({
    id: groupIds!,
    setUserIds,
  });

  React.useEffect(() => {
    if (!groupIds) {
      goToSelectGroupList();
      return;
    }
  }, [groupIds]);

  const selectedGroup = useAppSelector(selectGroupById(groupIds!)) as Group;

  const handleDelete = () => setGroupIds(undefined);
  const handleSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const onFilter = (selected: Set<number> | SelectedAllType) => {
    switch (selected) {
      case 'SELECTED_ALL':
        const _selected = new Set(members.map(member => member.userID!));
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

  const handleMessageSend = async (text: string) => {
    try {
      setIsLoading(true);
      const { id } = await sendIamOkMessage({
        groupIds: [groupIds!],
        name: text,
        userIds: Array.from(userIds),
        subject,
      });
      setIsLoading(false);
      dispatch(fetchImOkList());
      dispatch(fetchGroups());
      onFinish();
      id && goToIamOk(id);
    } catch (e) {
      setIsLoading(false);
      confirm({
        title: 'warning',
        description: e,
        onCancel: () => {},
        confirmText: 'retry',
        cancelText: 'cancel',
      });
    }
  };

  const goToSelectGroupList = () => {
    navigation('/startIamOk');
  };
  const goToIamOkList = () => {
    navigation(`/imOk`);
  };
  const goToIamOk = (id: number) => {
    navigation(`/muster/${id}`);
  };

  const highlightText = () => {
    if (subjectRef.current) subjectRef.current.focus();
  };

  if (isLoading) return <Loader />;
  return (
    <SContainer>
      {selectedGroup && (
        <HorizontalScrollSummaryList
          withoutBottomSeperator
          withoutAddButton
          data={[selectedGroup]}
          onAddButtonClick={goToSelectGroupList}
          omSummaryClick={goToSelectGroupList}
          OnDeleteItem={handleDelete}
        />
      )}
      <SLine />
      <SSummaryTab
        title={translate('recepients')! + ':'}
        summaryText={getRecipantsText(members, userIds || new Set())}
        onTabClick={() => setRecipientsFilter(true)}
      />
      <SItem className="input">
        <SSimpleText className="left" fontSize="12px">
          {translate(`messages_subject_add`)}
        </SSimpleText>
        <SInput
          onChange={handleSubject}
          value={subject}
          type="text"
          placeholder={translate(`messages_subject_add_placeholder`)!}
          ref={subjectRef}
        />

        <SIcon src={Pencil} onClick={highlightText} alt="" className="pencil" />
      </SItem>

      {!isGettingMembers && (
        <FilterOrSelectBottomSheet
          isOpen={recipientsFilter}
          setIsOpen={setRecipientsFilter}
          onFilter={onFilter}
          data={members}
          initialSelected={userIds}
          withPhoto
          atLeastOneReq
          selectShapeType="box"
          titleTx="messages_selectRecepients"
          selectAllTx={'imOk_allRecepients'}
          hideCurrentUserId={user?.id}
        />
      )}
      <CecChatInput
        onMessageSend={handleMessageSend}
        text={text}
        setText={setText}
      />
    </SContainer>
  );
};
