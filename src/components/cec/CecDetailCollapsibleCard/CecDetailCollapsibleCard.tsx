import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../../theme/colors';
import Arrow from '../../../assets/imgs/cec/summary-right-arrow.svg';
import Seen from '../../../assets/imgs/cec/cec-seen.svg';
import { translate } from '../../../utils/translate';

const SConatainer = styled.div<{ $expanded?: boolean; $needExpand?: boolean }>`
  padding: 1rem;
  padding-right: 1.75rem;
  background-color: ${palette.gunmetal};
  border: 2px solid ${palette.siamiBlue};
  border-radius: 0.625rem;
  width: 100%;

  ${props =>
    props.$needExpand &&
    css`
      cursor: pointer;
    `}

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SMainWrapper = styled.div<{ $expanded?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.43rem;

  img {
    transform: rotate(90deg);
    transition: transform 0.3s;

    ${props =>
      props.$expanded &&
      css`
        transform: rotate(270deg);
      `}
  }
`;
const STitlesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.4375rem;
`;

const SRecipientWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &:not(:last-child) {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${palette.siamiBlue};
  }
`;
const SRecipientTitlesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;
const SRecipientContactWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SNamTitle = styled.p`
  font-family: 'Roboto-Bold';
  font-weight: 700;
  font-size: 0.875rem;
  color: ${palette.white};
`;

const SSubTitle = styled.p<{ sendTime?: boolean; readText?: boolean }>`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.75rem;
  color: ${palette.silver};
  ${props =>
    props.readText &&
    css`
      max-width: 50%;
    `}
  ${props =>
    props.sendTime &&
    css`
      color: ${palette.appleGreeen};
    `}
`;

export interface RecipientContact {
  id: number;
  title: string;
  sendTime: 'NOT_SENT' | 'NOT_READ' | string;
}
export interface RecipientListItem {
  id: number;
  nameTitle: string;
  professionSubtitle: string;
  contact: RecipientContact[];
}

export interface ICecDetailCollapsibleCardProps {
  title: string;
  subTitle: string;
  recipients: RecipientListItem[];
  needExpand?: boolean;
}

export const CecDetailCollapsibleCard = (
  props: ICecDetailCollapsibleCardProps
) => {
  const { recipients, subTitle, title, needExpand = true } = props;

  const [expanded, setExpanded] = React.useState<boolean>(false);

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  const renderContactSendState = (
    sendTime: 'NOT_SENT' | 'NOT_READ' | string
  ) => {
    if (sendTime === 'NOT_SENT')
      return <SSubTitle>{translate('message_not_sent')}</SSubTitle>;
    if (sendTime === 'NOT_READ')
      return <SSubTitle>{translate('message_not_read')}</SSubTitle>;
    return (
      <SRecipientTitlesWrapper>
        <SSubTitle sendTime>{sendTime}</SSubTitle>
        <img src={Seen} alt="Seen" />
      </SRecipientTitlesWrapper>
    );
  };

  return (
    <SConatainer $expanded $needExpand={needExpand} onClick={toggleExpand}>
      <SMainWrapper $expanded={expanded}>
        <STitlesWrapper>
          <SNamTitle>{title}</SNamTitle>
          <SSubTitle readText>{subTitle}</SSubTitle>
        </STitlesWrapper>
        {needExpand && <img src={Arrow} alt="right-arrow" />}
      </SMainWrapper>
      {needExpand && expanded && (
        <>
          {recipients.map((recipient, index) => (
            <SRecipientWrapper key={`${recipient.id}-${index}`}>
              <SRecipientTitlesWrapper>
                <SNamTitle>{recipient.nameTitle}</SNamTitle>
                <SSubTitle>{recipient.professionSubtitle}</SSubTitle>
              </SRecipientTitlesWrapper>
              {recipient.contact.map((contact, i) => (
                <SRecipientContactWrapper
                  key={`${recipient.id}-${contact.title}-${i}`}
                >
                  <SSubTitle>{contact.title}</SSubTitle>
                  {renderContactSendState(contact.sendTime)}
                </SRecipientContactWrapper>
              ))}
            </SRecipientWrapper>
          ))}
        </>
      )}
    </SConatainer>
  );
};
