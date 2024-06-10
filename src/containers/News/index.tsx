import * as React from 'react';
import Drawer from 'react-bottom-drawer';
import styled from 'styled-components';
import DrawerFilter from '../../components/DrawerFilter/DrawerFilter';
import { NewsItemCard } from '../../components/NewsItemCard/NewsItemCard';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
import {
  selectNews,
  selectNewsIsLoading,
  selectNewsListSource,
  setNews,
} from './newsSlice';
import { fetchNews } from './newsSlice/actionCreators';
import { NewsItem, SourceItem } from './newsSlice/types';
import { ReactComponent as ArrowIcon } from '../../assets/imgs/news/news_arrow_down.svg';
import Loader from '../../components/Loader/Loader';
import { SDrawerWrapper } from '../../components/cec/CecTextTemplatesBottomSheet/CecTextTemplatesBottomSheet';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';
import noResultImg from '../../assets/imgs/NotFound/no-result.svg';

export const News = () => {
  const dispatch = useAppDispatch();
  const listNews = useAppSelector(selectNews);
  const listSources = useAppSelector(selectNewsListSource);
  const isLoading = useAppSelector(selectNewsIsLoading);
  const [selectedSources, setSelectedSource] = React.useState<SourceItem[]>([
    // {
    //   id: -1,
    //   name: translate('news_filter_all') as string,
    // }
  ]);
  const [filteredNews, setFilteredNews] = React.useState<NewsItem[]>([]);
  const [selectedNewsindex, setSelectedNewsIndex] = React.useState<number>(-1);
  const [isDrawerVisible, setDrawerVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(fetchNews());

    return () => {
      dispatch(setNews([]));
      setFilteredNews([]);
    };
  }, [dispatch]);

  React.useEffect(() => {
    onFilterNews(selectedSources);
  }, [listSources, selectedSources]);

  const onSelectSource = (sources: SourceItem[]) => {
    setSelectedSource(sources);
    onCloseDrawer();
  };

  const onFilterNews = (sources: SourceItem[]) => {
    const sourceIds = sources.map((s) => s.id);
    if (sourceIds.length === 0 || sourceIds.includes(-1)) {
      setFilteredNews([...listNews]);
    } else {
      const filteredNews = listNews.filter((n) => sourceIds.includes(n.feedID));
      setFilteredNews([...filteredNews]);
    }
  };

  const onOpenDrawer = React.useCallback(() => setDrawerVisible(true), []);
  const onCloseDrawer = React.useCallback(() => setDrawerVisible(false), []);

  return (
    <SNewsContainer>
      <SFilterButton onClick={onOpenDrawer}>
        {selectedSources.length > 0
          ? selectedSources.sort((a, b) => a.id - b.id)[0].name
          : translate('news_filter_all')}
        <ArrowIcon />
      </SFilterButton>

      {isLoading && <Loader />}

      {!isLoading && (
        <>
          <SNewsList>
            {filteredNews.map((news, index) => (
              <NewsItemCard
                key={index}
                item={news}
                currentItemIndex={index}
                selectedItemIndex={selectedNewsindex}
                onSelectItem={(index: number) => setSelectedNewsIndex(index)}
              />
            ))}
          </SNewsList>
          <EmptyListFallback
            src={noResultImg}
            listLength={filteredNews.length}
            isLoading={false}
            searchTerm={''}
            emptyListTx={'news-empty'}
            noSearchTx={''}
          />
        </>
      )}

      <SDrawer>
        <Drawer
          isVisible={isDrawerVisible}
          onClose={onCloseDrawer}
          mountOnEnter={true}
          hideScrollbars={false}
          duration={250}
          className="customDrawer"
        >
          <SDrawerWrapper>
            <DrawerFilter
              sources={listSources}
              chosenSources={selectedSources}
              setChooseSource={setSelectedSource}
              onApply={onSelectSource}
              onCancel={onCloseDrawer}
            />
          </SDrawerWrapper>
        </Drawer>
      </SDrawer>
    </SNewsContainer>
  );
};

const SNewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  margin: 1rem 0;
  height: 100%;
`;

const SFilterButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 2.75rem;
  font-size: 1rem;
  color: ${palette.white};
  background-color: ${palette.prussianBlue2};
  border: 1px solid ${palette.queenBlue};
  border-radius: 0.75rem;
  margin-bottom: 1rem;

  svg {
    margin-left: 0.5rem;
  }
`;

const SNewsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const SDrawer = styled.div`
  .customDrawer {
    background-color: ${palette.prussianBlue2};
    padding: 1.25rem 2rem;
    left: 0;
    right: 0;
    bottom: 0;
    width: 40vw;
    max-height: 75vh;
    min-width: 26rem;
    max-width: 26rem;
    margin: auto;
    z-index: 9999;
    // margin-bottom: 76px;
  }
  .customDrawer__content {
    padding: 0;
    overflow-y: hidden;
    height: 100%;
    max-height: 100%;
    > div {
      height: 100%;
    }
  }
  .customDrawer__handle-wrapper {
    display: none;
  }
`;
