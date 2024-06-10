import { NewsItem } from "../../containers/News/newsSlice/types";
import { ApiCore } from "../utils/core";

const url = '';

const ApiMedia = new ApiCore({
  getAll: false,
  getSingle: false,
  post: false,
  put: false,
  patch: false,
  remove: false,
  singleExtra: true,
  url: url,
});

// News start
export const getNews = () => {
  return ApiMedia.performExtra<NewsItem[]>({
    method: 'GET',
    extraResource: `news`,
  });
};
