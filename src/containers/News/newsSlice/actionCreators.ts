import { batch } from 'react-redux';
import { setNews, setIsLoading, setIsError, setListSource } from '.';
import { AppThunk } from '../../../store';
import { getNews } from '../../../apis/newsAPI';
import { SourceItem } from './types';
import { translate } from '../../../utils/translate';

export const fetchNews = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    const news = await getNews();
    const sources: SourceItem[] = [
      { id: -1, name: translate('news_filter_all') as string },
    ];

    news.forEach((i) => {
      if (!sources.find((s) => s.id === i.feedID)) {
        sources.push({ id: i.feedID, name: i.feedName } as SourceItem);
      }
    });

    batch(() => {
      dispatch(setNews(news));
      dispatch(setListSource(sources));
      dispatch(setIsLoading(false));
    });
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setIsLoading(false));
      dispatch(setIsError(`${error}`));
    });
  }
};
