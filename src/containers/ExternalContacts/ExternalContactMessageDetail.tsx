import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchExternalMessageDetail } from '../../apis/externalContacts';
import { ExternalMessageDetail } from '../../apis/externalContacts/types';
import { CecDetailCollapsibleCard } from '../../components/cec/CecDetailCollapsibleCard/CecDetailCollapsibleCard';
import Loader from '../../components/Loader/Loader';
import { palette } from '../../theme/colors';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { SList } from '../CreateCecMessage/styles';
import {
  getCecMessageAsSendingMethod,
  transformListRecipients,
} from './helpers';

const SAsSubTitle = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 0.875rem;
  font-style: italic;
  color: ${palette.white};

  align-self: flex-start;

  margin-bottom: 0.625rem;
`;

const SOverideSList = styled(SList)`
  gap: 0.625rem;
`;
export interface IExternalContactMessageDetailProps {
  cecId: number;
}

export const ExternalContactMessageDetail = (
  props: IExternalContactMessageDetailProps
) => {
  const { cecId } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cecMessage, setCecMessage] = React.useState<ExternalMessageDetail>();

  const confirm = useConfirmation();
  const { t } = useTranslation();

  const init = async () => {
    try {
      setIsLoading(true);
      const _cec = await fetchExternalMessageDetail(cecId);
      setCecMessage(_cec);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      confirm({
        title: 'warning',
        description: 'general_network_error',
        onSubmit: () => {},
        confirmText: 'retry',
      });
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  if (isLoading) return <Loader />;
  return (
    <>
      {cecMessage && (
        <>
          <SOverideSList>
            <SAsSubTitle>
              {getCecMessageAsSendingMethod(cecMessage)}
            </SAsSubTitle>
            {cecMessage.contactLists.map((list, index) => (
              <CecDetailCollapsibleCard
                title={list.name}
                key={`${list.id}-${list.name}-${index}`}
                subTitle={t('messages_recipients_read_message', {
                  recipientsReadCount: list.numberOfConfirmedContacts,
                  recipientsTotalCount: list.numberOfContacts,
                })}
                recipients={transformListRecipients(list.id, cecMessage)}
                needExpand={!!list.numberOfContacts}
              />
            ))}
          </SOverideSList>
        </>
      )}
    </>
  );
};
