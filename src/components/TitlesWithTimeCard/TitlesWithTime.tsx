import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import Dots from '../../assets/imgs/documents/documents_dots.svg';
import classNames from 'classnames';

export interface ITitlesWithTimeProps {
  date: string;
  time?: string;
  title: string;
  subTitle: string;
  subTitleSender?: string;
  itemId: number;
  onMoreOptionClick?: (itemId: number) => void;
  onClick?: (itemId: number) => void;
}

export const TitlesWithTime = (props: ITitlesWithTimeProps) => {
  const {
    date,
    itemId,
    subTitle,
    title,
    onMoreOptionClick,
    time,
    subTitleSender,
    onClick,
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMoreOptionClick) {
      e.stopPropagation();
      onMoreOptionClick(itemId);
    }
  };

  const subtTitleClasses = classNames('subTitle', {
    subTitleWithSender: !!subTitleSender,
  });

  const _onClick = () => onClick && onClick(itemId);

  return (
    <SContainer onClick={onClick && _onClick}>
      <SGrowDiv>
        <SRow className="top">
          <STitle>{title}</STitle>
          <p className="date">{date}</p>
        </SRow>
        <SRow>
          <p className={subtTitleClasses}>
            {subTitleSender && (
              <span className="subTitleSender">{subTitleSender}: </span>
            )}
            {subTitle}
          </p>
          {time && <p className="time">{time}</p>}
        </SRow>
      </SGrowDiv>
      {onMoreOptionClick && (
        <SMoreOptionBtn onClick={handleClick}>
          <img src={Dots} alt="" />
        </SMoreOptionBtn>
      )}
    </SContainer>
  );
};

const SContainer = styled.li`
  padding: 0.68rem 1.25rem;
  width: 100%;
  background-color: ${palette.prussianBlue};
  border-radius: 0.625rem;
  font-family: 'Roboto-Regular';
  font-size: 0.75rem;
  line-height: 0.875rem;
  color: ${palette.silver};

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  cursor: pointer;

  .date,
  .time {
    align-self: flex-end;
    max-width: 30%;
    min-width: 22%;
    font-size: 0.7125rem;
    text-align: end;
  }
  .date {
    color: ${palette.white};
  }

  .subTitle {
    margin-right: 0.1rem;
  }
  .subTitleWithSender {
    color: ${palette.white};
  }
  .subTitleSender {
    color: ${palette.silver};
  }

  display: flex;
  flex-direction: row;
`;

const SGrowDiv = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

const STitle = styled.p`
  color: ${palette.white};
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 1rem;
  margin-right: 0.1rem;
`;

const SRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  min-width: 0;
  &.top {
    margin-bottom: 0.625rem;
  }
`;

const SMoreOptionBtn = styled.button`
  background: none;
  border: none;
  padding: 0 0.6rem;
  margin-left: 0.6rem;
  cursor: pointer;
`;
