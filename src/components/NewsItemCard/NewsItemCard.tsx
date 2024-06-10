import * as React from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as DateIcon } from '../../assets/imgs/news/news_clock.svg';
import { NewsItem } from '../../containers/News/newsSlice/types';
import { palette } from '../../theme/colors';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { sanitizeText } from '../../utils/sanitizeText';
import { transformDate } from '../../utils/transformDate';
import { translate } from '../../utils/translate';
import { trunctateText } from '../../utils/truncate';

export interface INewsItemCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  item: NewsItem;
  currentItemIndex: number;
  selectedItemIndex: number;
  onSelectItem: any;
  initialIsOpen?: boolean;
}

const SNewsItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: ${palette.white};
  background-color: ${palette.prussianBlue2};
  border: 1px solid ${palette.queenBlue};
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
`;

const SNewsItemTitle = styled.a`
  font-size: 0.9rem;
  color: ${palette.white};
  margin-bottom: 0.5rem;
  text-decoration: none;
`;

const SNewsItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const SNewsItemInfoSource = styled.span`
  font-size: 0.85rem;
  color: ${palette.silver};
`;

const SNewsItemInfoDate = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  color: ${palette.silver};

  svg {
    margin-right: 0.25rem;
  }
`;

const SNewsItemContent = styled.p`
  font-size: 0.9rem;
  color: ${palette.white};
`;

const SNewsItemRead = styled.span`
  font-size: 0.9rem;
  color: ${palette.gold};
  margin-left: 0.25rem;
  cursor: pointer;
`;

export const NewsItemCard = (props: INewsItemCardProps) => {
  const {
    item,
    currentItemIndex,
    selectedItemIndex,
    onSelectItem,
    initialIsOpen = false,
  } = props;
  const [isitemOpened, setIsItemOpened] =
    React.useState<boolean>(initialIsOpen);
  const limitedWords = 120;

  const onToggleContent = () => {
    onSelectItem(currentItemIndex);
    setIsItemOpened(prevState => !prevState);
  };

  React.useEffect(() => {
    // To avoid click twice for expanding news item.
    // This issue happens when one news item is aleady expanded and need to open another news item and rest need to be contacted.
    if (selectedItemIndex === currentItemIndex) {
      setIsItemOpened(true);
    }
  }, [selectedItemIndex]);

  const getCharacterLength = (text: string): number => {
    return sanitizeText(text, 'html').length;
  };

  return (
    <SNewsItem>
      <SNewsItemTitle target="_blank" href={item?.externalURL}>
        {item?.event}
      </SNewsItemTitle>
      <SNewsItemInfo>
        <SNewsItemInfoSource>{item?.feedName}</SNewsItemInfoSource>
        <SNewsItemInfoDate>
          <DateIcon />
          {getDateFormatCustom(
            item?.date,
            dateFormats.mothNameShortDateTimeNoComma24
          )}
        </SNewsItemInfoDate>
      </SNewsItemInfo>
      <SNewsItemContent>
        {selectedItemIndex === currentItemIndex &&
        getCharacterLength(item?.text) > limitedWords &&
        isitemOpened
          ? sanitizeText(item?.text, 'html')
          : trunctateText(sanitizeText(item?.text, 'html'), limitedWords)}

        <SNewsItemRead onClick={onToggleContent}>
          {selectedItemIndex === currentItemIndex &&
          getCharacterLength(item?.text) > limitedWords &&
          isitemOpened
            ? translate('news_read_less')
            : selectedItemIndex === currentItemIndex &&
              getCharacterLength(item?.text) > limitedWords &&
              !isitemOpened
            ? translate('news_read_more')
            : selectedItemIndex !== currentItemIndex &&
              getCharacterLength(item?.text) > limitedWords
            ? translate('news_read_more')
            : ''}
        </SNewsItemRead>
      </SNewsItemContent>
    </SNewsItem>
  );
};
