import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { FilterSection } from '../../components/SearchFilterBar/SearchFilterBar';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { RecipientButton } from '../../components/RecipientButton/RecipientButton';
import { sendAMessage } from '../CreateMessage/createMessageSlice/actionCreators';
import Arrow from '../../assets/imgs/chats/arrow.svg';
import Pencil from '../../assets/imgs/chats/edit-yellow.svg';

import { useTranslation } from 'react-i18next';
import MessageTypeFilter from '../CreateMessage/MessageTypeFilter';
import { selectUser } from '../Login/LoginSlice';
import { CreateMessageModel } from '../Chat/Chat';
import { saveDocumentToServer } from '../../apis/mediaAPI';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getIamOkInitiallSelected,
  getReplyTypeId,
} from './createMessageIamOkSummary.helpers';
import { fetchImOkDocument } from './imOkSlice/actionCreators';
import { selectImOkDocument, selectImOkIsLoading } from './imOkSlice';
import Loader from '../../components/Loader/Loader';
import { getRecipantsText, useGetMembers } from '../StartIamOkMessage/helpers';
import {
  FilterOrSelectBottomSheet,
  SelectedAllType,
} from '../../components/FilterOrSelectBottomSheet/FilterOrSelectBottomSheet';
import { IamOkMessageMembersType } from '../../routes/ImOk';
import { selectGroupById } from '../GroupsList/groupsSlice';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { SimpleText } from '../../components/Chat/ChatListItem.styles';
import ChatBox from '../../components/Chat/ChatBox';
import { Page } from '../../components/Page/Page';

export enum GroupsToShow {
  All = 'labelAll',
  MemberOfGroup = 'messages_groups_where_member',
  NotMemberOfGroup = 'messages_groups_where_not_member',
}

const FILTER_SECTIONS: FilterSection[] = [
  {
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
  },
];

export const CreateMessageIamOkSummary = () => {
  const imOkDocument = useAppSelector(selectImOkDocument);
  const isLoading = useAppSelector(selectImOkIsLoading);

  const { membersType, id } = useParams();

  const fetchImOk = async () => {
    dispatch(fetchImOkDocument(id || ''));
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const groupId = imOkDocument?.groups[0].id!;
  const user = useAppSelector(selectUser);

  const selectedGroup = useAppSelector(selectGroupById(groupId));

  const { members: membersForFilter, isGettingMembers } = useGetMembers({
    id: groupId,
    // withoutCurrentUserId: user?.id,
  });

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

  const [userIds, setUserIds]: [Set<number>, (set: Set<number>) => void] =
    useState(new Set());
  const selectedGroups = [selectedGroup!];

  useEffect(() => {
    dispatch(fetchGroups());
  }, []);

  useEffect(() => {
    if (!imOkDocument) fetchImOk();
    const selected = getIamOkInitiallSelected({
      meesageType: membersType as IamOkMessageMembersType,
      iamOk: imOkDocument!,
      // withoutCurrentUserId:  user?.id
    });

    setUserIds(selected);
  }, [imOkDocument]);

  const [typeFilters, setTypeFilters] =
    useState<FilterSection[]>(FILTER_SECTIONS);
  const [subjectText, setSubjectText] = useState<string>('');
  const [recipientsFilter, setRecipientsFilter] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<boolean>(false);
  const [replyType, setReplyType] = useState<string>('messages_replyToAll');
  const [tabBar, setTabBar] = useState<boolean>(true);

  const handleSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectText(e.target.value);
  };
  const { t } = useTranslation();

  const getIDs = <T extends { id: number }>(list: T[]) => {
    return _.map(list, item => item.id);
  };

  const sendMessage = (
    text?: string,
    imageFileNames?: string[],
    documentFileNames?: string[],
    audioFileNames = [],
    locationId?: number
  ) => {
    const recipientsIDs: number[] = [...userIds];
    const groupsIDs: number[] = getIDs(selectedGroups);

    const messageModel: CreateMessageModel = {
      subject: subjectText === '' ? null : subjectText,
      senderId: user?.id,
      groupIds: groupsIDs.length === 0 ? null : groupsIDs,
      recipientIds: recipientsIDs.length === 0 ? null : recipientsIDs,
      documentFileNames: documentFileNames,
      audioFileNames: audioFileNames,
      photoFileNames: imageFileNames,
      text: text,
      locationId: locationId,
      // replyType: getReplyTypeId(replyType),
    };

    dispatch(sendAMessage(messageModel, navigate));
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

  const renderToInput = () => {
    return (
      <SimpleText fontSize="14px">
        {getRecipantsText(membersForFilter, userIds || new Set())}
      </SimpleText>
    );
  };

  if (!imOkDocument && isLoading) return <Loader />;

  return (
    <SPage>
      <div style={{ padding: '0 1.25rem' }}>
        <GroupContainer>
          {selectedGroups.length !== 0 && (
            <>
              {_.map(selectedGroups, (group, key) => {
                return (
                  <RecipientButton
                    key={key}
                    name={group?.name}
                    onClick={() => navigate(`/muster/${id}`)}
                  />
                );
              })}
            </>
          )}
        </GroupContainer>
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
            hideCurrentUserId={user?.id}
          />
        )}
        {/* <MessageTypeFilter
          isOpen={typeFilter}
          typeList={typeFilters}
          setIsOpen={() => setTypeFilter(!typeFilter)}
          setCheckedState={setTypeFilters}
          setReplyType={setReplyType}
        /> */}
        <SLine className="moreMargin" />

        <SItem onClick={() => setRecipientsFilter(!recipientsFilter)}>
          <SimpleText className="left" fontSize="12px">
            {t(`messages_to`)}
          </SimpleText>
          {renderToInput()}
          <div style={{ flex: 1 }} />
          <SIcon src={Arrow} alt="" />
        </SItem>
        <SLine />

        {/* <SItem onClick={() => setTypeFilter(!typeFilter)}>
          <SimpleText className="left" fontSize="12px">
            {t(`messages_replyTo`)}
          </SimpleText>
          <SimpleText fontSize="14px">{t(`${replyType}`)}</SimpleText>
          <div style={{ flex: 1 }} />
          <SIcon src={Arrow} alt="" />
        </SItem>
        <SLine />

        <SItem className="input">
          <SimpleText className="left" fontSize="12px">
            {t(`messages_subject_add`)}
          </SimpleText>
          <SInput
            onChange={handleSubject}
            value={subjectText}
            type="text"
            placeholder={t(`messages_subject_add_placeholder`)}
          />
          <div style={{ flex: 1 }} />
          <SIcon src={Pencil} alt="" />
        </SItem>
        <SLine /> */}
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

const SPage = styled(Page)`
  padding: 1.25rem 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
`;

export const SLine = styled.hr`
  margin: 0 0 1px 0;
  height: 1px;
  border: none;
  background-color: ${palette.queenBlue};
  border-radius: 49px;
  &.moreMargin {
    margin: 0.625rem 0 1px 0;
  }
`;
const SItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem 0;

  &.input {
    cursor: default;
  }
  .left {
    width: 5rem;
  }

  cursor: pointer;
`;

const SInput = styled.input`
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
  vertical-align: text-bottom;
  margin-right: 1rem;
`;

export const CreateMessageButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CreateMessageListWrapper = styled.div`
  padding: 1rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const AddGroupButton = styled.div`
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
`;
