import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { useEffect, useRef, useState } from 'react';
import { FilterSection } from '../../components/SearchFilterBar/SearchFilterBar';
import _, { compact } from 'lodash';
import {
  createMessageIsLoading,
  getSelectedGroups,
  getSelectedGroupType,
  getSelectedUsers,
  selectActiveTab,
  selectGroupMembers,
  setGroupMembers,
  setSelectedUsers,
  setIsLoading,
} from './createMessageSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Add from '../../assets/imgs/general/black-add-icon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { RecipientButton } from '../../components/RecipientButton/RecipientButton';
import {
  deleteGroupAction,
  deleteUserAction,
  sendAMessage,
} from './createMessageSlice/actionCreators';
import { CreateChatFilter } from '../../components/Chat/CreateChatFilter';
import { SimpleText } from '../../components/Chat/ChatListItem.styles';
import Arrow from '../../assets/imgs/chats/arrow.svg';
import Pencil from '../../assets/imgs/chats/edit-yellow.svg';

import { useTranslation } from 'react-i18next';
import MessageTypeFilter from './MessageTypeFilter';
import ChatBox from '../../components/Chat/ChatBox';
import { selectUser } from '../Login/LoginSlice';
import { CreateMessageModel } from '../Chat/Chat';
import { saveDocumentToServer } from '../../apis/mediaAPI';
import { Page } from '../../components/Page/Page';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { ActiveTab, GroupType } from '../../utils/enums';
import { GroupMember } from '../GroupDetail/groupDetailSlice/types';
import {
  intersicetedWithGroupMembers,
  isAddGroupHidden,
  isSameUser,
  onlyInSelectListUser,
} from './helpers';
import { SelectListUser } from './createMessageSlice/types';
import Loader from '../../components/Loader/Loader';

export enum GroupsToShow {
  All = 'labelAll',
  MemberOfGroup = 'messages_groups_where_member',
  NotMemberOfGroup = 'messages_groups_where_not_member',
}

enum SoundType {
  Alarm = 'messages_sound_alarm',
  Regular = 'messages_sound_regular',
}

const SOUND_FILTERS: FilterSection = {
  title: 'messages_sound_selection_intro',
  type: 'radio',
  content: [
    {
      id: 0,
      name: SoundType.Regular,
      checked: true,
    },
    {
      id: 1,
      name: SoundType.Alarm,
      checked: false,
    },
  ],
};

const FILTER_SECTIONS: FilterSection = {
  title: 'messages_show_groups',
  type: 'radio',
  content: [
    {
      id: 0,
      name: 'messages_replyToAll',
      checked: true,
    },
    {
      id: 1,
      name: 'messages_replyToSender',
      checked: false,
    },
    {
      id: 2,
      name: 'messages_noReply',
      checked: false,
    },
  ],
};

const CreateMessageSummary = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const confirm = useConfirmation();
  const { t } = useTranslation();

  const selectedUsers = useAppSelector(getSelectedUsers);
  const selectedGroups = useAppSelector(getSelectedGroups);
  const selectedGroupType = useAppSelector(getSelectedGroupType);
  const user = useAppSelector(selectUser);
  const membersinSelectedGroups = useAppSelector(selectGroupMembers);
  const activeTab = useAppSelector(selectActiveTab);
  const loading = useAppSelector(createMessageIsLoading);

  // extra users that are in the selected user and don't come as a part of the group members
  const onlyInSelectedList = onlyInSelectListUser(
    selectedUsers,
    membersinSelectedGroups,
    isSameUser
  );

  const [subjectText, setSubjectText] = useState('');
  const [isRecipientsFilterOpen, setIsRecipientsFilterOpen] = useState(false);
  const [tabBar, setTabBar] = useState(true);

  const [typeFilters, setTypeFilters] = useState(
    JSON.parse(JSON.stringify(FILTER_SECTIONS))
  );
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [replyType, setReplyType] = useState(typeFilters.content[0].name!);

  const [soundFilters, setSoundFilters] = useState(
    JSON.parse(JSON.stringify(SOUND_FILTERS))
  );
  const [soundFilterOpen, setSoundFilterOpen] = useState(false);
  const [soundType, setSoundType] = useState<string>(
    soundFilters.content[0].name!
  );

  const subjectRef = useRef<HTMLInputElement>(null);

  const checkedMembers = _.filter(
    [...onlyInSelectedList, ...membersinSelectedGroups],
    (member) => {
      if (member.isSelected) {
        return true;
      } else {
        return false;
      }
    }
  );
  const emptyUsers = _.isEmpty(selectedUsers);
  const emptyGroups = _.isEmpty(selectedGroups);
  const isGroups = activeTab === ActiveTab.Groups;

  useEffect(() => {
    if (emptyUsers && !isGroups) {
      navigate('/createMessage');
    }
    if (emptyGroups && isGroups) {
      navigate('/createMessage');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, selectedUsers, selectedGroups]);

  const getIDs = (list: any[]) => {
    return compact(
      _.map(list, (item) => {
        if (item.isSelected) return item.id || item.userID;
      })
    );
  };

  const getGroupsIDs = (list: any[]) => {
    return compact(_.map(list, (groupItem) => groupItem.id));
  };

  const getReplyTypeId = () => {
    switch (replyType) {
      case 'messages_replyToAll':
        return 0;
      case 'messages_replyToSender':
        return 1;
      default:
        return 2;
    }
  };

  const sendMessage = (
    text?: string,
    imageFileNames?: string[],
    documentFileNames?: string[],
    audioFileNames?: string[],
    locationId?: number
  ) => {
    const recipientsIDs: number[] = isGroups
      ? getIDs(checkedMembers)
      : getIDs(selectedUsers);
    const groupsIDs: number[] = isGroups ? getGroupsIDs(selectedGroups) : [];

    const messageModel: CreateMessageModel = {
      subject: subjectText === '' ? null : subjectText,
      senderId: user?.id,
      groupIds: groupsIDs,
      recipientIds: recipientsIDs.includes(user?.id!)
        ? recipientsIDs
        : [...recipientsIDs, user?.id!],
      documentFileNames: documentFileNames,
      audioFileNames: audioFileNames,
      photoFileNames: imageFileNames,
      text: text,
      locationId: locationId,
      replyType: getReplyTypeId(),
    };

    if (recipientsIDs.length === 1 && _.head(recipientsIDs) === user?.id) {
      confirm({
        title: 'sidebar_settings_testModalTitle',
        description: 'select_single_user_group_error',
        onSubmit: () => {
          dispatch(setIsLoading(false));
        },
      });
    } else {
      dispatch(sendAMessage(messageModel, navigate));
    }
  };

  const onPhotosSend = async (imagesList: string[], messageText: string) => {
    if (imagesList.length > 0) {
      const text =
        messageText && messageText.length > 0 ? messageText : undefined;
      sendMessage(text, imagesList);
    }
  };

  const onDocumentsSend = async (
    documentsList: File[],
    messageText: string
  ) => {
    const documentsFilesNamesArray = [];

    for await (let document of documentsList) {
      const formData = new FormData();
      formData.append('document', document);
      const result = await saveDocumentToServer(formData);
      if (result) {
        documentsFilesNamesArray.push(result);
      }
    }

    if (documentsFilesNamesArray.length > 0) {
      const text =
        messageText && messageText.length > 0 ? messageText : undefined;

      sendMessage(text, [], documentsFilesNamesArray);
    }
  };

  const handleOnFilter = (
    selectedMembers: GroupMember[],
    extraUser?: SelectListUser[]
  ) => {
    dispatch(setGroupMembers(selectedMembers));
    extraUser &&
      dispatch(
        setSelectedUsers([
          ...extraUser,
          ...selectedMembers.map((member) => ({
            id: member.userID,
            displayName: member.userName,
            title: member.info,
            photoFileName: null,
            email: member.userEmail,
            creatorId: null,
            phoneNumber: member.phoneNumber,
            isSelected: member.isSelected,
            admin: member.admin,
          })),
        ])
      );
    setIsRecipientsFilterOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  const renderRecipients = () => {
    if (emptyGroups) return <></>;
    return (
      <>
        <SItem>
          <SimpleText className="left" fontSize="12px">
            {t(`messages_to`)}
          </SimpleText>
          <SClickableItem
            onClick={() => setIsRecipientsFilterOpen(!isRecipientsFilterOpen)}
          >
            <SimpleText fontSize="14px" className="right">
              {checkedMembers.length ===
              membersinSelectedGroups.length + onlyInSelectedList.length
                ? t(`messages_allMembers`)
                : checkedMembers.length === 0
                ? t(`messages_selectRecipients`)
                : _.map(checkedMembers, (user) =>
                    'userName' in user ? user.userName : user.displayName
                  ).join(', ')}
            </SimpleText>
            <SIcon src={Arrow} alt="" className="" />
          </SClickableItem>
        </SItem>
        <SLine />
      </>
    );
  };

  const withoutCurrentUserFilter = (
    list: (GroupMember | SelectListUser)[]
  ): (GroupMember | SelectListUser)[] => {
    return list.filter((item) =>
      'userName' in item ? item.userID !== user?.id : item.id !== user?.id
    );
  };

  const renderType = () => {
    if (
      emptyGroups ||
      selectedGroupType.includes(GroupType.Hidden) ||
      selectedGroupType.includes(GroupType.CoAlert)
    )
      return <></>;

    return (
      <>
        <SItem>
          <SimpleText className="left" fontSize="12px">
            {t(`messages_replyTo`)}
          </SimpleText>
          <SClickableItem onClick={() => setTypeFilterOpen(!typeFilterOpen)}>
            <SimpleText fontSize="14px" className="right">
              {t(replyType)}
            </SimpleText>
            <SIcon src={Arrow} alt="" />
          </SClickableItem>
        </SItem>
        <SLine />
      </>
    );
  };

  const renderSound = () => {
    if (!selectedGroupType.includes(GroupType.CrossOrg)) return <></>;

    return (
      <>
        <SItem>
          <SimpleText className="left" fontSize="12px">
            {t(`messages_sound`)}
          </SimpleText>
          <SClickableItem onClick={() => setSoundFilterOpen(!soundFilterOpen)}>
            <SimpleText fontSize="14px" className="right">
              {t(soundType)}
            </SimpleText>
            <SIcon src={Arrow} alt="" />
          </SClickableItem>
        </SItem>
        <SLine />
      </>
    );
  };

  const renderSubject = () => {
    if (selectedGroupType.includes(GroupType.CoAlert)) return <></>;
    const highlightText = () => {
      if (subjectRef.current) subjectRef.current.focus();
    };

    return (
      <>
        <SItem className="input">
          <SimpleText className="left" fontSize="12px">
            {t(`messages_subject_add`)}
          </SimpleText>
          <SInput
            ref={subjectRef}
            onChange={(e) => setSubjectText(e.target.value)}
            value={subjectText}
            type="text"
            placeholder={t(`messages_subject_add_placeholder`)}
          />
          <SIcon
            src={Pencil}
            alt=""
            className="pencil"
            onClick={highlightText}
          />
        </SItem>
        <SLine />
      </>
    );
  };

  return (
    <SPage>
      <div style={{ padding: '0 1.25rem' }}>
        <GroupContainer>
          {!isAddGroupHidden(selectedGroups) && (
            <Link to="/createMessage">
              <AddButton>
                <img src={Add} alt="add" />
              </AddButton>
            </Link>
          )}

          {selectedGroups.map((group) => (
            <RecipientButton
              key={`group-${group.id}`}
              name={group.name}
              onClick={() =>
                dispatch(deleteGroupAction(group.id, group.groupType))
              }
            />
          ))}
          {emptyGroups && (
            <>
              {selectedUsers.map((selectedUser) => (
                <RecipientButton
                  key={`user-${selectedUser.id}`}
                  name={selectedUser.displayName}
                  onClick={() => dispatch(deleteUserAction(selectedUser.id))}
                />
              ))}
            </>
          )}
        </GroupContainer>
        <CreateChatFilter
          serachbarTitle="messages_selectRecepients"
          title={'messages_allMembers'}
          label={'messages_filter'}
          isOpen={isRecipientsFilterOpen}
          items={
            withoutCurrentUserFilter(membersinSelectedGroups) as GroupMember[]
          }
          /// refactoring needed
          extraMembers={
            onlyInSelectedList
              ? (withoutCurrentUserFilter(
                  onlyInSelectedList
                ) as SelectListUser[])
              : undefined
          }
          setIsOpen={() => setIsRecipientsFilterOpen(!isRecipientsFilterOpen)}
          onFilter={handleOnFilter}
          isCoAlert={selectedGroupType.includes(GroupType.CoAlert)}
        />
        <MessageTypeFilter
          isOpen={soundFilterOpen}
          list={soundFilters}
          setIsOpen={() => setSoundFilterOpen(!soundFilterOpen)}
          setCheckedState={setSoundFilters}
          setType={setSoundType}
        />
        <MessageTypeFilter
          isOpen={typeFilterOpen}
          list={typeFilters}
          setIsOpen={() => setTypeFilterOpen(!typeFilterOpen)}
          setCheckedState={setTypeFilters}
          setType={setReplyType}
        />
        <SLine />
        {renderRecipients()}
        {renderType()}
        {renderSound()}
        {renderSubject()}
      </div>
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

export default CreateMessageSummary;

export const SLine = styled.hr`
  margin: 0;
  height: 1px;
  border: none;
  background-color: ${palette.queenBlue};
  border-radius: 49px;
`;

export const SItem = styled.div`
  display: flex;
  padding: 0.6rem 0;
  align-items: center;

  &.input {
    cursor: default;
  }
  .left {
    width: 5rem;
  }
  .right {
    max-width: 100%;
    flex: 1;
  }
`;

export const SClickableItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

export const SInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: none;
  font-family: 'Roboto-Regular';
  font-size: 14px;
  color: ${palette.white};
  :focus-visible {
    outline: none;
  }
`;

export const SIcon = styled.img`
  &.pencil {
    cursor: text;
  }
`;

export const CreateMessageButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const SPage = styled(Page)`
  padding: 1.25rem 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const AddButton = styled.div`
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
