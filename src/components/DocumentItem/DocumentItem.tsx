import * as React from 'react';
import styled, { css } from 'styled-components';
import Dots from '../../assets/imgs/documents/document-dots.svg';
import { palette } from '../../theme/colors';
import { TextWithExtention } from '../TextWithExtention/TextWithExtention';
import { documentIcons, DocumentIconType } from './helpers';

export interface IDocumentItemProps {
  title: string;
  subTitle?: string;
  itemId: number;

  iconVariant: DocumentIconType;

  boldTitle?: boolean;
  fileExtension?: boolean;
  pdfLink?: string;

  onMoreOptionClick?: (itemId: number) => void;
  onCLick?: (itemId: number) => void;
}

export const DocumentItem = (props: IDocumentItemProps) => {
  const {
    itemId,
    subTitle,
    title,
    onMoreOptionClick,
    onCLick,
    boldTitle,
    iconVariant,
    fileExtension,
    pdfLink,
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onMoreOptionClick && onMoreOptionClick(itemId);
  };

  const _onClick = () => {
    onCLick && !pdfLink && onCLick(itemId);
    pdfLink &&
      window.open(`https://devapi.cosafe.se/api/Media${pdfLink}`, '_blank');
  };

  return (
    <SContainer $boldTitle={boldTitle} onClick={_onClick}>
      <img
        className="icon"
        src={documentIcons[iconVariant]}
        alt={iconVariant}
      />
      <SGrowDiv>
        {fileExtension ? (
          <STextWithExtention className="title" text={title} />
        ) : (
          <p className="title">{title}</p>
        )}
        <p className={'subTitle'}>{subTitle}</p>
      </SGrowDiv>
      {onMoreOptionClick && (
        <SMoreOptionBtn onClick={handleClick}>
          <img src={Dots} alt="" />
        </SMoreOptionBtn>
      )}
    </SContainer>
  );
};

interface SContainerProps {
  $boldTitle?: boolean;
}

const SContainer = styled.li<SContainerProps>`
  display: flex;
  align-items: center;

  text-decoration: none;

  width: 100%;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.prussianBlue4};
  }

  padding: 1.1875rem 0rem;

  font-family: 'Roboto-Regular';

  .icon {
    width: 1.75rem;
  }

  img {
    flex-shrink: 0;
  }

  .title {
    color: ${palette.white};
    font-size: 0.875rem;
    font-weight: 400;

    ${props =>
      props.$boldTitle &&
      css`
        font-size: 1rem;
        font-weight: 500;
      `}
  }
  .subTitle {
    color: ${palette.silver};
    font-size: 0.75rem;
    font-weight: 400;
  }

  .title,
  .subTitle :not(:last-child) {
    margin-bottom: 0.25rem;
  }

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  cursor: pointer;
`;

const SGrowDiv = styled.div`
  flex-grow: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
  margin: 0 1.125rem;
`;

const SMoreOptionBtn = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const STextWithExtention = styled(TextWithExtention)`
  color: ${palette.white};
  font-size: 0.875rem;
  font-weight: 400;
`;
