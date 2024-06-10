import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  CreatorName,
  IconImage,
  MessagesContainer,
  SimpleText,
  Subject,
  ToggleButton,
  TopRow,
} from './OnCallAlert.styles';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { translate } from '../../utils/translate';
import openText from '../../assets/imgs/general/open-text.svg';
import closeText from '../../assets/imgs/general/close-text.svg';
import { OnCallAlertDocumentSimple } from '../../containers/OnCallAlertList/onCallAlertSlice/types';
import { addPhoneAndMailLinks } from './helpers';
import parse from 'html-react-parser';

export interface OnCallAlertMessageProps {
  onCallAlertDocument: OnCallAlertDocumentSimple;
  onMessagedToggled?: (toggled: boolean) => void;
}

const OnCallAlertMessage = React.forwardRef<
  HTMLDivElement,
  OnCallAlertMessageProps
>((props, ref) => {
  const { onCallAlertDocument, onMessagedToggled } = props;
  const { senderName, text, subject, groupName, started } = onCallAlertDocument;
  const [isOpen, setIsOpen] = useState(true);
  const maxMessagesLength = 52;
  const messagesText = isOpen
    ? addPhoneAndMailLinks(text || '')
    : _.truncate(addPhoneAndMailLinks(text || ''), {
        length: maxMessagesLength,
      });

  useEffect(() => {
    onMessagedToggled && onMessagedToggled(isOpen);
  }, [isOpen]);

  return (
    <MessagesContainer ref={ref}>
      <TopRow marginBottom={'0.2rem'}>
        <CreatorName>{senderName}</CreatorName>
        <Subject>{subject || ''}</Subject>
      </TopRow>
      <TopRow marginBottom={'0.4rem'}>
        <SimpleText>{`${translate('imOk_to')}: ${groupName}`}</SimpleText>
        <SimpleText>
          {getDateFormatCustom(
            started || '',
            dateFormats.yearMonthDayTimeNoComma24
          )}
        </SimpleText>
      </TopRow>
      <TopRow>
        <SimpleText>
          {`${translate('imOk_message')}: `}
          {parse(messagesText)}
        </SimpleText>
        {text?.length > 52 && (
          <ToggleButton onClick={() => setIsOpen(!isOpen)}>
            <IconImage alt="" src={isOpen ? openText : closeText} />
          </ToggleButton>
        )}
      </TopRow>
    </MessagesContainer>
  );
});

export default OnCallAlertMessage;
