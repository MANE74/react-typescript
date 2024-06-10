import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import { ReactComponent as Add } from '../../assets/imgs/cec/cec-add.svg';

// [TODO: compose into a seperated component (SummaryItem) - start ]
import Remove from '../../assets/imgs/general/remove.svg';

const SSummaryText = styled.p`
  font-family: 'Roboto-Regular';
  font-size: 10px;
  font-weight: 400;
  color: ${palette.white};

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const SSummaryWrapper = styled.button`
  border: 1px solid ${palette.queenBlue};
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.68rem;

  cursor: pointer;

  padding: 0.5rem 0.875rem;
  background-color: ${palette.fadedDarkBlue};

  img {
    cursor: pointer;
  }
`;
// [TODO: compose into a seperated component - end ]

const SContainer = styled.div<{ $withoutBottomSeperator?: boolean }>`
  display: flex;
  align-items: center;

  ${props =>
    !props.$withoutBottomSeperator &&
    css`
      border-bottom: 1px solid ${palette.queenBlue};
    `}
  padding-bottom: 1rem;
`;

const SAddButton = styled.button`
  border: 0;
  height: 2.2rem;
  width: 2.2rem;
  aspect-ratio: 1;
  border-radius: 999rem;

  margin-right: 0.43rem;

  cursor: pointer;

  align-self: flex-start;

  background-color: ${palette.honeyYellow};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SHorizontalList = styled.div`
  display: inline-flex;
  align-items: center;
  width: calc(100% - 2.43rem);
  gap: 0.43rem;

  flex-wrap: wrap;
`;

interface DataListType {
  id: number;
  name: string;
}
export interface IHorizontalScrollSummaryListProps<T> {
  data: T[];
  onAddButtonClick: () => void;
  omSummaryClick: (id: number) => void;
  OnDeleteItem: (id: number) => void;
  className?: string | undefined;

  withoutAddButton?: boolean;
  withoutBottomSeperator?: boolean;
}

export const HorizontalScrollSummaryList = <T extends DataListType>(
  props: IHorizontalScrollSummaryListProps<T>
) => {
  const {
    data,
    onAddButtonClick,
    OnDeleteItem,
    className,
    omSummaryClick,
    withoutAddButton = false,
    withoutBottomSeperator = false,
  } = props;

  const handleSummaryDelete = React.useCallback(
    (id: number) => (e: React.MouseEvent<HTMLImageElement>) => {
      e.stopPropagation();
      OnDeleteItem(id);
    },
    [OnDeleteItem]
  );

  const handleSummaryClick = React.useCallback(
    (id: number) => () => omSummaryClick(id),
    [omSummaryClick]
  );

  return (
    <SContainer
      $withoutBottomSeperator={withoutBottomSeperator}
      className={className}
    >
      {!withoutAddButton && (
        <SAddButton className="SAddButton" onClick={onAddButtonClick}>
          <Add />
        </SAddButton>
      )}
      <SHorizontalList className="SHorizontalList">
        {data.map((listItem, index) => (
          // [TODO: compose into a seperated component (SummaryItem) - start ]
          <SSummaryWrapper
            key={`${listItem.id}-${index}`}
            className="SSummaryWrapper"
            onClick={handleSummaryClick(listItem.id)}
          >
            <SSummaryText>{listItem.name}</SSummaryText>
            <img
              src={Remove}
              alt="removeGroup"
              onClick={handleSummaryDelete(listItem.id)}
            />
          </SSummaryWrapper>
          // [TODO: compose into a seperated component - end ]
        ))}
      </SHorizontalList>
    </SContainer>
  );
};
