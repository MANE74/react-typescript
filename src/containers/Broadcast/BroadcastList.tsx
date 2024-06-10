import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
import { getBroadcastMsg, setBroadcastMsg } from './broadcastSlice';
import { MessageListItem } from '../../components/MessageListItem/MessageListItem';
import { selectUser } from '../Login/LoginSlice';
import { fetchBroadcastMesaage } from './broadcastSlice/actionCreators';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import Options from '../../components/Options/Options';
import { BroadcastMsg } from './broadcastSlice/types';
import Forward from '../../assets/imgs/chats/forward.svg';
import Copy from '../../assets/imgs/chats/copy.svg';
import GreenCheck from '../../assets/imgs/chats/green-check.svg';
import { setForwardedMessage } from '../CreateMessage/createMessageSlice';

export interface IBroadcastListProps {
  setShowThreeDots: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBroadcastInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setSubMessage: any;
  showBroadcastInfo: boolean;
}

export const BroadcastList = (props: IBroadcastListProps) => {
  const {} = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const broadcastMsg: BroadcastMsg = useAppSelector(getBroadcastMsg);
  const [msgOptionsOpen, setMsgOptionsOpen] = React.useState<boolean>(false);
  const [copyState, setCopyState] = React.useState<string>(Copy);

  React.useEffect(() => {
    dispatch(setBroadcastMsg(null));
  }, []);

  React.useEffect(() => {
    dispatch(setBroadcastMsg(null));
    dispatch(fetchBroadcastMesaage(Number(id)));
    if (user?.id !== broadcastMsg?.senderID) {
      props.setShowThreeDots(false);
    }
  }, [id, user]);

  React.useEffect(() => {
    if (broadcastMsg?.id) {
      const orgCount = broadcastMsg?.organizations?.length;
      const orgName = _.head(broadcastMsg?.organizations)?.name;
      props.setSubMessage(
        orgCount && orgCount > 1
          ? `${orgCount} ${translate('messages_title_info_label')}`
          : `${orgName} ${translate('messages_broadcast_subaccount')}`
      );
    }
    if (user?.id === broadcastMsg?.senderID) {
      props.setShowThreeDots(true);
    }
  }, [broadcastMsg]);

  React.useEffect(() => {
    if (props.showBroadcastInfo) {
      navigate(`recipients`)
      props.setShowBroadcastInfo(true)
    }
  }, [props.showBroadcastInfo]);

  const handleDate = (time: string) => {
    return getDateFormatCustom(time!, dateFormats.mothNamePlusDate);
  };

  const onclickDots = (id: number) => {
    setMsgOptionsOpen(!msgOptionsOpen)
  };

  const forward = () => {
    if (!broadcastMsg) return;
    const model: any = {
      text: broadcastMsg.text,
      photoFileNames: broadcastMsg.photoFileNames || [],
      documentFileNames: broadcastMsg.documentFileNames || [],
      locationID: broadcastMsg.locationID || undefined,
    };

    dispatch(setForwardedMessage(model));
    navigate(`/message/${id}/forward`);
  }; 

  const copyText = () => {
    if (broadcastMsg.text) {
      navigator.clipboard.writeText(broadcastMsg.text);
      setCopyState(GreenCheck);

      setTimeout(() => {
        setMsgOptionsOpen(false);
        setCopyState(Copy);
      }, 1500);
    }
  };
  return (
    <UserListWrapper>
      <>
        <MsgDate>
          {handleDate(broadcastMsg?.lastReplySent || broadcastMsg?.sent!)}
        </MsgDate>

        {broadcastMsg && (
          <MessageList>
            {[broadcastMsg].map((chat, key) => (
              <MessageListItem
                key={key}
                message={chat}
                handleDots={onclickDots}
                userId={user?.id!}
              />
            ))}
          </MessageList>
        )}

        <Options
          isOpen={msgOptionsOpen}
          setIsOpen={setMsgOptionsOpen}
          items={[
            {
              id: 1,
              name: 'messages_forward',
              icon: Forward,
              callback: forward,
            },
            {
              id: 3,
              name: 'messages_copy',
              icon: copyState,
              callback: copyText,
            },
          ]}
        />
      </>
    </UserListWrapper>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export default BroadcastList;

const UserListWrapper = styled.div`
  margin: 0 1rem 0 1rem;
`;

const CreateMessageButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const MessageList = styled.div<any>`
  // margin: 0 1rem;

  height: ${(props) => props.height};

  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MsgDate = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 15px 0;
  font-size: 13px;
  color: ${palette.silver};
`;
