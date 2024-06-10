import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../components/Loader/Loader';
import Options from '../../components/Options/Options';
import { ProfilePicture } from '../../components/ProfilePicture/ProfilePicture';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import addIcon from '../../assets/imgs/general/black-add-icon.svg';
import {
  selectCurrentChat,
  selectMessagesRecipients,
} from '../ChatsList/chatListSlice';
import {
  fetchCurrentChat,
  getMessagesRecipientsAction,
  deleteAMessage,
  endAlertAction,
} from '../ChatsList/chatListSlice/actionCreators';
import { selectUser, selectUserRoles } from '../../containers/Login/LoginSlice';
import Delete from '../../assets/imgs/chats/delete.svg';
import { ReactComponent as GreenCheck } from '../../assets/imgs/chats/green-check.svg';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import _ from 'lodash';
import { IconImage } from '../../components/ImOk/ImOk.styles';
import {
  fetchGroupMembers,
  setSelectedGroupsAction,
  setSelectedUsersAction,
} from '../CreateMessage/createMessageSlice/actionCreators';
import {
  createMessageIsLoading,
  selectGroupMembers,
} from '../CreateMessage/createMessageSlice';
import { fetchMessageGroups } from './chatDetailsSlice/actionCreators';
import { getMessageGroups, messageDetailsIsLoading } from './chatDetailsSlice';
import { Link } from 'react-router-dom';
import { GroupType, ReceivedMessageType } from '../../utils/enums';
import { Page } from '../../components/Page/Page';
import { Chat } from '../ChatsList/chatListSlice/types';
import { translate } from '../../utils/translate';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { getMessageHeaderSubTitle } from '../Chat/helpers';

interface ChatDetailsProps {
  optionsOpen: boolean;
  setOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClickOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAlarmActive: React.Dispatch<React.SetStateAction<boolean>>;
  fromHoldingStatment?: boolean;
}

function ChatDetails(props: ChatDetailsProps) {
  const {
    optionsOpen,
    setOptionsOpen,
    onClickOptions,
    setIsAlarmActive,
    fromHoldingStatment,
  } = props;

  const navigate = useNavigate();
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const layout = useLayoutContext();

  const user = useAppSelector(selectUser);
  const message = useAppSelector(selectCurrentChat);
  const recipients = useAppSelector(selectMessagesRecipients);
  const groupsMembers = useAppSelector(selectGroupMembers);
  const isLoading = useAppSelector(createMessageIsLoading);
  const isMessageDetailsLoading = useAppSelector(messageDetailsIsLoading);
  const messageGroups = useAppSelector(getMessageGroups);
  const roles = useAppSelector(selectUserRoles);
  const [isAdmin, setIsAdmin] = useState(false);

  const isSender = _.isEqual(message?.senderID, user?.id);
  const isSenderOrAdmin = () => {
    if (_.isEqual(message?.type, ReceivedMessageType.Broadcast)) {
      return isSender;
    } else {
      return isAdmin || isSender;
    }
  };

  let canDeleteMessage = isSender || roles?.includes('DeleteMessage');

  useEffect(() => {
    if (message) {
      setHeader(message);
      getGroupInfo();
    } else {
      dispatch(fetchCurrentChat(id!));
    }

    const groupIds = message?.groupIDs;
    if (groupIds) {
      dispatch(fetchMessageGroups(groupIds));
      dispatch(fetchGroupMembers(groupIds));
    }
  }, [message]);

  useEffect(() => {
    const foundMemberData = _.find(groupsMembers, (member) =>
      _.isEqual(member.userID, user?.id)
    );
    if (foundMemberData) {
      setIsAdmin(foundMemberData.admin ? true : false);
    }
  }, [groupsMembers]);

  //Cleanup
  useEffect(() => {
    dispatch(setSelectedGroupsAction([]));
    dispatch(setSelectedUsersAction([]));
    return () => {
      fetchGroupMembers([]);
    };
  }, []);

  const setHeader = (message: Chat) => {
    let subText = '';
    if (message.type === 2 && !message.recalled) {
      setIsAlarmActive(true);
    } else {
      setIsAlarmActive(false);
    }
    if (message.type === 9) {
      // holding statement
      if (message.subject) {
        layout.setMessage(message.subject);
      }
    }
    subText = getMessageHeaderSubTitle(message, t, ' / ');
    layout.setSubTitle(subText);
    if (canDeleteMessage) layout.setDoShowDots(true);
  };

  const hasGroups =
    !_.isUndefined(message?.groupNames) && !_.isEmpty(messageGroups);
  const hasNotNormalGroupTypes = _.find(
    messageGroups,
    (group) => group.groupType !== GroupType.Normal
  );

  const showAddGroupsBtn =
    (roles?.includes('AddRecipientsToAnyMessage ') || isSender) &&
    hasGroups &&
    !hasNotNormalGroupTypes &&
    !message?.onCallAlertID &&
    !message?.musterID;

  const showEndBtn =
    message?.type === 2 &&
    !message?.recalled &&
    (isSender || roles?.includes('EndAlarm'));

  const getGroupInfo = () => {
    dispatch(getMessagesRecipientsAction(Number(id)));
  };

  const handleDelete = () => {
    if (!message) return;
    confirm({
      title: 'messages_delete_title',
      description: 'messages_deleteMessage',
      onSubmit: () => {
        dispatch(
          deleteAMessage(message.id, navigate, false, fromHoldingStatment)
        );
        setOptionsOpen(false);
      },
      onCancel: () => {
        setOptionsOpen(false);
      },
      confirmText: 'messages_delete',
      cancelText: 'cancel',
    });
  };

  const handleEnd = () => {
    if (!message) return;
    confirm({
      title: 'messages_delete_title',
      description: 'messages_endAlarmText',
      onSubmit: () => {
        dispatch(endAlertAction(message.id));
      },
      onCancel: () => {},
      confirmText: 'messages_endAlarm',
      cancelText: 'cancel',
      confirmStyle: 'red',
    });
  };

  if (!message || isMessageDetailsLoading) {
    return <Loader />;
  }

  const getOptionsItems = () => {
    let itemsList = [];

    if (canDeleteMessage) {
      itemsList.push({
        name: 'messages_delete',
        icon: Delete,
        callback: handleDelete,
      });
    }
    return itemsList;
  };

  const handleOrgType = (org: any) => {
    return !org?.parentId
      ? `${translate('messages_broadcast_account')}`
      : `${translate('messages_broadcast_subaccount')}`;
  };

  const handleNavigateToProfile = (uid: number) => {
    navigate(`memberSettings/${uid}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SPage>
      <Options
        isOpen={optionsOpen}
        setIsOpen={onClickOptions}
        setTabBar
        items={getOptionsItems()}
      />
      <SChatDetails>
        <SBoxContainer>
          {showAddGroupsBtn && (
            <AddBtn
              to={
                fromHoldingStatment
                  ? '/createHoldingStatement'
                  : `/message-details/${id}/addRecipients`
              }
            >
              <IconImage alt="" src={addIcon} />
            </AddBtn>
          )}

          {message.groupNames.map((groupName, key) => (
            <SBox key={key}>
              <p>{groupName}</p>
            </SBox>
          ))}
        </SBoxContainer>
        {!message.organizations.length && (
          <SText>
            {message.recipientReadCount} {t(`messages_out`)}{' '}
            {message.recipientCount} {t(`messages_red`)}
          </SText>
        )}
        <SRecipientsList>
          {!!message.organizations.length &&
            message.organizations.map((recipient, key) => (
              <li key={key}>
                {key !== 0 && <SLine />}
                <SRecipient>
                  <Column>
                    <Row>
                      <p>{recipient.name}</p>
                      <STitle>{handleOrgType(message?.Organization)}</STitle>
                    </Row>
                    <SSeenContainer>
                      {/*  this part still needed to be fixed , i updated onyl the part about the date and time format */}
                      <SSeen seen={true}>
                        {t('messages_recipient_sent_on')}{' '}
                        {getDateFormatCustom(
                          message.sent,
                          dateFormats.yearMonthDayTimeNoComma24
                        )}
                      </SSeen>
                      <>
                        <div className="checkContainer">
                          <GreenCheck />
                        </div>
                      </>
                    </SSeenContainer>
                  </Column>
                </SRecipient>
              </li>
            ))}
          {recipients &&
            !message.organizations.length &&
            recipients?.map((recipient, key) => (
              <li key={key}>
                {key !== 0 && <SLine />}
                <SRecipient
                  onClick={() => handleNavigateToProfile(recipient.userID)}
                >
                  <ProfilePicture
                    profilePictureFileName={recipient.photoFileName}
                  />
                  <Column>
                    <Row>
                      <p>{recipient.displayName}</p>
                      <STitle>{recipient.title}</STitle>
                    </Row>
                    <SSeenContainer>
                      <SSeen seen={recipient.read}>
                        {recipient.read
                          ? `${t(`messages_seen`)} ${getDateFormatCustom(
                              recipient.lastRead,
                              dateFormats.yearMonthDayTimeNoComma24
                            )} `
                          : t(`messages_notSeen`)}
                      </SSeen>
                      {recipient.read && (
                        <>
                          <div className="checkContainer">
                            <GreenCheck />
                            <GreenCheck />
                          </div>
                        </>
                      )}
                    </SSeenContainer>
                  </Column>
                </SRecipient>
              </li>
            ))}
        </SRecipientsList>
      </SChatDetails>
      {showEndBtn && (
        <BigFloatButton
          onClick={handleEnd}
          tx="checklist_action_end"
          color="red"
        />
      )}
      {message.type === 2 && message.recalled && !optionsOpen && (
        <SEnded>
          <p>{t(`checklist_ended`)}</p>
        </SEnded>
      )}
    </SPage>
  );
}

export default ChatDetails;

const SPage = styled(Page)`
  height: 100%;
  padding: 1.25rem 0 0 0;
  display: flex;
  flex-direction: column;
`;

const SChatDetails = styled.div`
  padding: 0 1.25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SBox = styled.div`
  margin-left: 0.25rem;
  margin-bottom: 0.25rem;
  max-width: 140px;
  height: 30px;
  border-radius: 8px;
  background-color: ${palette.prussianBlue};
  border: 1px solid ${palette.queenBlue};
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    padding: 0 0.75rem 0 0.75rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Column = styled.div`
  margin-left: 0.75rem;
  height: 2.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const STitle = styled.p`
  margin: 0.2rem 0.6rem;
  color: ${palette.silver};
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
`;

export const SLine = styled.hr`
  margin: 0.75rem 0;
  height: 1px;
  border: none;
  background-color: ${palette.prussianBlue4};
  border-radius: 49px;
`;

const SSeenContainer = styled.div`
  display: flex;
  align-items: center;

  .checkContainer {
    position: relative;
    width: 1rem;
    height: 11px;
    display: flex;
    align-items: flex-end;

    svg {
      position: absolute;

      :first-child {
        left: 4px;
      }
    }
  }
`;

const AddBtn = styled(Link)`
  cursor: pointer;
  background-color: ${palette.honeyYellow};
  height: 32px;
  width: 32px;
  border-radius: 16px;
  margin-right: 0.25rem;
  align-content: center;
  justify-content: center;
  border: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const SText = styled.p`
  margin: 1.25rem 0;
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
`;

const SSeen = styled.p<any>`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => (props.seen ? palette.applGreen : palette.silver)};
  margin-right: 0.5rem;
`;

const SRecipientsList = styled.ul`
  min-height: 0;
  height: 100%;
  padding-bottom: 6rem;

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SRecipient = styled.div`
  display: flex;
  cursor: pointer;
`;

const SEnded = styled.div`
  background-color: ${palette.stormGray};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
`;
