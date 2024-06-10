import * as React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
import { getBroadcastMsg } from './broadcastSlice';
import { deleteBroadcastMessageAction, fetchBroadcastMesaage } from './broadcastSlice/actionCreators';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import CheckIcon from '../../assets/imgs/general/check-icon.svg';
import { BroadcastMsg } from './broadcastSlice/types';
import _ from 'lodash';
import Options from '../../components/Options/Options';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import DeleteIcon from '../../assets/imgs/general/delete.svg';
import { setIsLoading } from '../CreateMessage/createMessageSlice';

export interface IBroadcastListProps {
  setShowThreeDots: React.Dispatch<React.SetStateAction<boolean>>;
  setSubMessage: React.Dispatch<React.SetStateAction<string>>;
  showBroadcastInfo: boolean;
}

export const RecipintList = (props: IBroadcastListProps) => {
  const {} = props;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const confirm = useConfirmation();
  const navigate = useNavigate();
  const broadcastMsg: BroadcastMsg = useAppSelector(getBroadcastMsg);
  const [optionsOpen, setOptionsOpen] = React.useState<boolean>(false);
  const [selectedMsgId, setSelectedMsgId] = React.useState<number>();

  React.useEffect(() => {
    props.setShowThreeDots(true)
    dispatch(fetchBroadcastMesaage(Number(id)));
  }, [id]);

  React.useEffect(() => {
    if (props.showBroadcastInfo) {
      setOptionsOpen(true);
      setSelectedMsgId(broadcastMsg.id);
    }
  }, [props.showBroadcastInfo]);

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
  }, [broadcastMsg]);

  const handleTime = (time: string) => {
    return getDateFormatCustom(time!, dateFormats.simpleTime);
  };

  const handleOrgType = (org: any) => {
    return !org?.parentId
      ? `${translate('messages_broadcast_account')}`
      : `${translate('messages_broadcast_subaccount')}`;
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'messages_delete_title',
      description: 'messages_delete_intro',
      onSubmit: () => {
        dispatch(deleteBroadcastMessageAction(id, broadcastMsg));
        dispatch(setIsLoading(false))
        setOptionsOpen(false);
        navigate('/broadcast/new');
      },
      onCancel: () => {
        setOptionsOpen(false);
      },
      confirmText: 'delete_message',
      cancelText: 'cancel',
    });
  };

  return (
    <RecipientListWrapper>
      <>
        {broadcastMsg && (
          <RecipientList height={'69vh'}>
            {broadcastMsg?.organizations?.map((org: any) => (
              <RecipientItem key={org?.id}>
                <Row>
                  <Name>{org.name}</Name>
                  <Type>{handleOrgType(broadcastMsg?.Organization)}</Type>
                </Row>
                <Row>
                  <Time>
                    {translate('messages_recipient_sent_on')}{' '}
                    {handleTime(
                      broadcastMsg?.lastReplySent || broadcastMsg?.sent!
                    )}
                  </Time>
                  <Icon>
                    <img src={CheckIcon} alt="checkmark" />
                  </Icon>
                </Row>
              </RecipientItem>
            ))}
          </RecipientList>
        )}
      </>
      <Options
          isOpen={optionsOpen}
          setIsOpen={setOptionsOpen}
          items={[
            {
              name: 'delete',
              icon: DeleteIcon,
              callback: () => {
                handleDelete(selectedMsgId!);
              },
            },
          ]}
        />
    </RecipientListWrapper>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export default connect(null, mapDispatchToProps)(RecipintList);

const RecipientListWrapper = styled.div`
  margin: 0 1rem 0 1rem;
`;

const RecipientList = styled.div<any>`
  margin: 0 1rem;
  margin-top: 15px;

  height: ${(props) => props.height};

  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const RecipientItem = styled.div<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid ${palette.queenBlue};
  padding: 15px 0;

  :last-child {
    border-bottom: none;
  }
`;

const Row = styled.div<any>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  :first-child {
    margin-bottom: 10px;
  }
`;

const Name = styled.span<any>`
  font-size: 16px;
  color: ${palette.white};
  margin-right: 10px;
`;

const Type = styled.span<any>`
  font-size: 12px;
  color: ${palette.stormGray};
`;

const Time = styled.span<any>`
  font-size: 12px;
  color: ${palette.appleGreeen};
  margin-right: 10px;
`;

const Icon = styled.span<any>``;
