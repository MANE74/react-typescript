import React, { useEffect, useState } from 'react';
import { ImOkDocumentSimple } from '../../containers/ImOkList/imOkSlice/types';
import _ from 'lodash';
import {
  CreatorName,
  IconImage,
  MessagesContainer,
  SimpleText,
  Subject,
  ToggleButton,
  TopRow,
} from './ImOk.styles';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { translate } from '../../utils/translate';
import openText from '../../assets/imgs/general/open-text.svg';
import closeText from '../../assets/imgs/general/close-text.svg';

export interface ImOkDocumentProps {
  imOkDocument: ImOkDocumentSimple;
  onMessagedToggled?: (toggled: boolean) => void;
}

const ImOkMessage = React.forwardRef<HTMLDivElement, ImOkDocumentProps>(
  (props, ref) => {
    const { imOkDocument, onMessagedToggled } = props;
    const { name, created } = imOkDocument;
    const [isOpen, setIsOpen] = useState(true);
    const maxMessagesLength = 52;
    const messagesText = isOpen
      ? name
      : _.truncate(name, {
          length: maxMessagesLength,
        });
    useEffect(() => {
      onMessagedToggled && onMessagedToggled(isOpen);
    }, [isOpen]);
    return (
      <MessagesContainer ref={ref}>
        <TopRow marginBottom={'0.2rem'}>
          <CreatorName>{imOkDocument.creatorname}</CreatorName>
          <Subject>{imOkDocument?.subject || ''}</Subject>
        </TopRow>
        <TopRow marginBottom={'0.4rem'}>
          <SimpleText>{`${translate('imOk_to')}: ${
            imOkDocument?.groups.length ? imOkDocument?.groups[0]?.name : ''
          }`}</SimpleText>
          <SimpleText>
            {getDateFormatCustom(
              created,
              dateFormats.yearMonthDayTimeNoComma24
            )}
          </SimpleText>
        </TopRow>
        <TopRow>
          <SimpleText>{`${translate(
            'imOk_message'
          )}: ${messagesText}`}</SimpleText>
          {name.length > 52 && (
            <ToggleButton onClick={() => setIsOpen(!isOpen)}>
              <IconImage alt="" src={isOpen ? openText : closeText} />
            </ToggleButton>
          )}
        </TopRow>
      </MessagesContainer>
    );
  }
);

export default ImOkMessage;
