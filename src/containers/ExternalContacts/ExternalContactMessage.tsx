import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import GreenCheck from '../../assets/imgs/chats/green-check.svg';
import Copy from '../../assets/imgs/chats/copy.svg';

import { CecMessage } from '../../components/cec/CecMessage/CecMessage';
import { ExternalMessage } from '../../apis/externalContacts/types';
import {
  getCecMessageAsSendingMethod,
  getCecMessageToListsNames,
  handleExternalContactsDate,
} from './helpers';
import Options, { OptionItemProps } from '../../components/Options/Options';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { dateFormats } from '../../utils/date';
const SOptions = styled(Options)`
  padding: 0;
  .cancel {
    flex-shrink: 0;
    p {
      color: ${palette.danger};
    }
  }
`;

const SContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 1.0625rem;
`;

const SDate = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.8125rem;
  line-height: 0.9375rem;
  color: ${palette.silverChalice};

  align-self: center;
`;

export interface IExternalContactMessageProps {
  cecMessage: ExternalMessage;
}

export const ExternalContactMessage = (props: IExternalContactMessageProps) => {
  const { cecMessage } = props;

  const navigation = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { setTabsState } = useLayoutContext();

  React.useEffect(() => {
    if (pathname === `/cec/${id}`) {
      setTabsState(false);
    } else {
      setTabsState(true);
    }
    return () => {
      setTabsState(true);
    };
  }, [pathname]);

  React.useEffect(() => {
    if (!cecMessage) {
      navigation('/cec');
    }
  }, []);

  const [copyState, setCopyState] = React.useState<string>(Copy);
  const [optionsOpen, setOptionsOpen] = React.useState(false);

  const copyText = () => {
    if (cecMessage?.text) {
      navigator.clipboard.writeText(cecMessage?.text);

      setOptionsOpen(false);
    }
  };

  var options: OptionItemProps[] = [
    {
      name: 'messages_copy',
      icon: copyState,
      callback: copyText,
    },
  ];

  return (
    <SContainer>
      <SDate>
        {handleExternalContactsDate(cecMessage, dateFormats.dayLongMonth)}
      </SDate>
      <CecMessage
        nameTitle={cecMessage.senderName}
        toSubtitle={getCecMessageToListsNames(cecMessage)}
        messageText={cecMessage.text}
        asSubTitle={getCecMessageAsSendingMethod(cecMessage)}
        time={handleExternalContactsDate(cecMessage, dateFormats.simpleTime24)}
        onDotsClick={() => {
          setOptionsOpen(true);
        }}
      />
      <SOptions
        items={options}
        isOpen={optionsOpen}
        setIsOpen={setOptionsOpen}
      />
    </SContainer>
  );
};
