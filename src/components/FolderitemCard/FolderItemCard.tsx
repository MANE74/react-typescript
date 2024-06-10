import * as React from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as Folder } from '../../assets/imgs/documents/documents_folder.svg';
import { ReactComponent as Pdf } from '../../assets/imgs/documents/documents_pdf.svg';
import { ReactComponent as Dots } from '../../assets/imgs/documents/documents_dots.svg';
import { NotificationBubble } from '../NotificationBubble/NotificationBubble';
import { palette } from '../../theme/colors';
import { TextWithExtention } from '../TextWithExtention/TextWithExtention';

export type DocumentType = 'document' | 'folder' | 'document_vertical_date';

const documentIcon = {
  document: <Pdf />,
  document_vertical_date: <Pdf />,
  folder: <Folder />,
};

export interface IFolderItemCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  itemId: number;
  title: string;
  subTitle: string | string[];

  selected: boolean;

  count?: number;
  varient?: DocumentType;
}

interface SItemContainerProps {
  selected: boolean;
  varient: DocumentType;
}

export const SFlexContainer = styled.div`
  display: flex;
  min-width: 0;
`;

const SItemContainer = styled(SFlexContainer)<SItemContainerProps>`
  /* text-decoration: none;
  display: flex;
  min-width: 0; */
  cursor: pointer;

  justify-content: space-between;

  align-items: center;

  border: 1px solid ${({ theme }) => theme.palette.border.primary};
  border-radius: 0.75rem;

  height: 4.06rem;
  width: 93%;
  padding: 0.93rem;

  &:hover {
    background-color: ${({ theme }) =>
      theme.palette.background.sideBarSelectedItem};
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${theme.palette.background.sideBarSelectedItem};
    `};

  ${({ varient, theme }) =>
    varient === 'document_vertical_date' &&
    css`
      height: 5.5rem;
      /* padding: 1rem; */
      align-items: flex-start;
    `}
  svg {
    flex-shrink: 0;
  }
`;

const SHorizontalWrapper = styled(SFlexContainer)<{ varient: DocumentType }>`
  align-items: flex-start;
  gap: 1.18rem;

  height: 100%;

  position: relative;
  svg {
    height: 55%;
    flex-shrink: 0;
  }
`;
const SVerticalWrapper = styled(SFlexContainer)`
  flex-direction: column;
  justify-content: center;

  gap: 0.25rem;
  margin-right: 1.1rem;
`;
const SRelativDiv = styled(SFlexContainer)<{ varient: DocumentType }>`
  flex-shrink: 0;
  position: relative;
  justify-content: center;
  width: 2.5rem;
  ${(props) =>
    props.varient === 'document_vertical_date' &&
    css`
      width: clamp(2.25rem, 12.5%, 3.75rem);
    `}
  svg {
    ${(props) =>
      props.varient === 'document_vertical_date' &&
      css`
        width: 100%;
      `}
  }
`;

interface STitleProps {
  sTitle?: boolean;
  subTitle?: boolean;
  changeColor?: string;
}
const STitle = styled.p<STitleProps>`
  background-color: 'yellow';

  color: ${({ theme }) => theme.palette.text.documentPrimary};
  font-family: 'Roboto-Regular';

  ${(props) =>
    props.sTitle &&
    css`
      font-size: 1rem;
    `}
  ${(props) =>
    props.subTitle &&
    css`
      font-size: 0.78rem;
    `}
  ${(props) =>
    props.changeColor &&
    css`
      color: ${props.changeColor};
    `}

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  & + span {
    color: ${({ theme }) => theme.palette.text.documentPrimary};
    font-family: 'Roboto-Regular';
    ${(props) =>
      props.sTitle &&
      css`
        font-size: 1rem;
      `}
  }
`;

const SSubTitleWrapper = styled(SFlexContainer)<{ vertical?: boolean }>`
  gap: 0.68rem;
  ${(props) =>
    props.vertical &&
    css`
      flex-direction: column;
      gap: 0.4rem;
    `}
`;

const SDotsButton = styled.button`
  background-color: transparent;
  border-color: transparent;
`;

const STextWithExtention = styled(TextWithExtention)<{ varient: DocumentType }>`
  ${(props) =>
    props.varient === 'document_vertical_date' &&
    css`
      font-size: 1.125rem;
    `}
`;

export const FolderItemCard = (props: IFolderItemCardProps) => {
  const {
    title,
    subTitle,
    varient = 'folder',
    count,
    selected,
    className,
  } = props;

  return (
    <SItemContainer
      onClick={() => {}}
      className={className}
      varient={varient}
      selected={selected}
    >
      <SHorizontalWrapper varient={varient}>
        <SRelativDiv varient={varient}>
          {count && <NotificationBubble isDanger notification={count} />}
          {documentIcon[varient]}
        </SRelativDiv>
        <SVerticalWrapper>
          <STextWithExtention varient={varient} text={title} />
          {Array.isArray(subTitle) ? (
            <SSubTitleWrapper vertical={varient === 'document_vertical_date'}>
              {subTitle.map((sub, i) => (
                <STitle
                  key={sub}
                  subTitle
                  changeColor={i === 0 ? palette.earthYellow : undefined} // instead of && to match the optional type  , any other handy ideas?
                >
                  {subTitle[i]}
                </STitle>
              ))}
            </SSubTitleWrapper>
          ) : (
            <STitle subTitle>{subTitle}</STitle>
          )}
        </SVerticalWrapper>
      </SHorizontalWrapper>
      <SDotsButton
        onClick={(event) => {
          event.stopPropagation();
          alert('the dots');
        }}
      >
        <Dots />
      </SDotsButton>
    </SItemContainer>
  );
};
