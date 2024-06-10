import * as React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import GroupsImagePlaceHolder from '../../assets/imgs/general/groups-place-holder.svg';
import Dots from '../../assets/imgs/documents/documents_dots.svg';

import { getImage } from '../../apis/mediaAPI';
import Highlighter from 'react-highlight-words';

const MAX_MEDIA_COUNT = 3;

export interface IHoldingStatementCardProps {
  date: string;
  time: string;
  title: string;
  subTitle: string;
  subTitleName: string;
  subject: string;
  media: string[];
  id: number;
  onClick: (id: number) => void;
  searchText?: string;
  onMoreOptionClick?: (itemId: number) => void;
}

export const HoldingStatementCard = (props: IHoldingStatementCardProps) => {
  const {
    date,
    media,
    subTitle,
    subTitleName,
    subject,
    time,
    title,
    id,
    onClick,
    searchText,
    onMoreOptionClick,
  } = props;
  const [photos, setPhotos] = React.useState<string[]>();

  const init = async () => {
    if (media.length !== 0) {
      try {
        const _photos = await Promise.all(
          media.map(name => getImage({ imageName: name }))
        );
        setPhotos(_photos);
      } catch (e) {
        console.log(e);
      }
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const mediaSource =
    photos && photos.length !== 0 ? photos : [GroupsImagePlaceHolder];

  const hasMediaSource = !!photos && photos.length !== 0;

  const handleClick = () => {
    onClick(id);
  };

  const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onMoreOptionClick && onMoreOptionClick(id);
  };
  return (
    <SWrapper>
      <SContainer onClick={handleClick}>
        <SCardHeader>
          {/* to prevent the design from failing if the title subject  "" don't know if it's needed or not  */}
          {subject ? <SSubjectText>{subject}</SSubjectText> : <div />}
          <p className="statment-date">{date}</p>
        </SCardHeader>
        <SCardBody>
          {hasMediaSource ? (
            <SMediaContainer>
              {mediaSource.map((image, index) => (
                <SImage
                  key={`${index}`}
                  index={index}
                  src={image}
                  alt={title}
                />
              ))}
            </SMediaContainer>
          ) : (
            <PlaceHolderWrapper src={GroupsImagePlaceHolder} alt="" />
          )}

          <STitlesContainer mediaLenght={mediaSource.length}>
            {/* to prevent the design from failing if the title recived  "" don't know if it's needed or not  */}
            {title ? (
              <STitle>{title}</STitle>
            ) : (
              <div style={{ height: '1.25rem' }} />
            )}
            <p>
              <span>{subTitleName}:</span>{' '}
              <Highlighter
                className="subTitle"
                highlightStyle={{ backgroundColor: palette.honeyYellow }}
                searchWords={[searchText || '']}
                textToHighlight={subTitle}
              />
            </p>
          </STitlesContainer>
          <p className="statment-time">{time}</p>
        </SCardBody>
      </SContainer>
      <SMoreOptionBtn onClick={handleMoreClick}>
        <img src={Dots} alt="" />
      </SMoreOptionBtn>
    </SWrapper>
  );
};

const SContainer = styled.div`
  font-family: 'Roboto-Regular';
  font-size: 0.75rem;
  line-height: 0.875rem;
  color: ${palette.white};
  .subTitle {
    span {
      font-size: 0.75rem;
      font-family: 'Roboto-Regular';
      color: ${palette.white};
    }
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  flex-grow: 1;
  max-width: 90%;
`;

const SWrapper = styled.div`
  cursor: pointer;
  padding: 1.25rem;
  :not(:last-child) {
    margin-bottom: 0.5rem;
  }
  width: 90%;

  background-color: ${palette.prussianBlue};
  border-radius: 0.625rem;

  display: flex;
  flex-direction: row;
`;

const SCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .statment-date {
    max-width: 30%;
  }
`;

const SSubjectText = styled.p`
  padding: 3px 5px;
  font-family: 'Roboto-Medium';
  font-weight: 600;
  font-size: 0.8125rem;
  line-height: 0.93rem;

  border-radius: 0.25rem;
  border: 1px solid ${palette.queenBlue};
  max-width: 50%;
`;
const STitle = styled.p`
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const SCardBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.6rem;

  .statment-time {
    align-self: flex-end;
    max-width: 30%;
    min-width: 10%;
    font-size: 0.7125rem;
  }
`;
const SMediaContainer = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
`;

const SImage = styled.img<{ index: number }>`
  display: inline-block;
  height: 2.5rem;
  width: 2.5rem;
  aspect-ratio: 1;

  ${props =>
    css`
      grid-area: 1 / 1 / 2 / 2;
      z-index: ${4 - props.index};
      margin-left: ${6 * props.index}px;
    `};
`;

const STitlesContainer = styled.div<{
  mediaLenght?: number;
}>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  min-width: 0;

  margin: 0 0.5rem 0 0rem;
  ${props =>
    css`
      margin-left: ${0.375 * (props.mediaLenght ?? MAX_MEDIA_COUNT) + 0.5}rem;
    `}
  span {
    color: ${palette.silver};
  }
`;

const PlaceHolderWrapper = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${palette.nightSkyBlue};
  border-radius: 999rem;
  padding: 0.5rem;
`;

const SMoreOptionBtn = styled.button`
  background: none;
  border: none;
  padding: 0 0.6rem;
  margin-left: 0.6rem;
  cursor: pointer;
`;
