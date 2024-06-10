import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { NewsItem, NewsState, SourceItem } from './types';

// initail state
const initialState: NewsState = {
    news: [],
    listNews: [],
    listSource: [],
    isLoading: false,
    isListLodaing: false,
    error: null,
  };

// news detail slice
export const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
      setNews: (state, action: PayloadAction<NewsItem[]>) => {
        state.news = action.payload;
      },
      setListNews: (state, action: PayloadAction<NewsItem[]>) => {
        state.listNews = action.payload;
      },
      setListSource: (state, action: PayloadAction<SourceItem[]>) => {
        state.listSource = action.payload;
      },
      setIsLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
      setIsListLoading: (state, action: PayloadAction<boolean>) => {
        state.isListLodaing = action.payload;
      },
      setIsError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      },
      reset: state => {
        state.error = null;
      },
    },
});

// export store actions
export const {
    setNews,
    setListNews,
    setListSource,
    setIsLoading,
    setIsListLoading,
    setIsError,
    reset,
} = newsSlice.actions;

// export the reducer
export default newsSlice.reducer;

// data selection
export const selectNews = (state: RootState) => state.news.news;
export const selectListNews = (state: RootState) => state.news.listNews;
export const selectNewsListSource = (state: RootState) => state.news.listSource;
export const selectNewsIsLoading = (state: RootState) => state.news.isLoading;
export const selectNewsIsListLoading = (state: RootState) => state.news.isListLodaing;
export const selectNewsError = (state: RootState) => state.news.error;
