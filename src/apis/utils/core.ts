import { Method } from 'axios';
import { apiProvider } from './provider';

export interface Options {
  url: string;
  getAll?: boolean;
  getSingle?: boolean;
  post?: boolean;
  put?: boolean;
  patch?: boolean;
  remove?: boolean;
  singleExtra?: boolean;
}

export interface PerformExtra {
  method: Method;
  extraResource: string;
  id?: number;
  model?: object;
  buffer?: boolean;
  params?: object;
  headers?: any; //AxiosRequestHeaders
}

export class ApiCore {
  getAll!: <T>() => Promise<T>;
  getSingle!: <T>(id: number) => Promise<T>;
  post!: <T>(model: object) => Promise<T>;
  put!: <T>(model: object) => Promise<T>;
  patch!: <T>(model: object) => Promise<T>;
  remove!: <T>(id: number) => Promise<T>;
  performExtra!: <T>(props: PerformExtra) => Promise<T>;

  constructor(options: Options) {
    if (options.getAll) {
      this.getAll = <T>() => {
        return apiProvider.getAll<T>(options.url);
      };
    }

    if (options.getSingle) {
      this.getSingle = <T>(id: number) => {
        return apiProvider.getSingle<T>(options.url, id);
      };
    }

    if (options.post) {
      this.post = <T>(model: object) => {
        return apiProvider.post<T>(options.url, model);
      };
    }

    if (options.put) {
      this.put = <T>(model: object) => {
        return apiProvider.put<T>(options.url, model);
      };
    }

    if (options.patch) {
      this.patch = <T>(model: object) => {
        return apiProvider.patch<T>(options.url, model);
      };
    }

    if (options.remove) {
      this.remove = <T>(id: number) => {
        return apiProvider.remove<T>(options.url, id);
      };
    }
    if (options.singleExtra) {
      this.performExtra = <T>(props: PerformExtra) => {
        const {
          method,
          extraResource,
          id,
          model,
          buffer = false,
          headers,
          params,
        } = props;
        return apiProvider.performExtra<T>(
          method,
          options.url,
          extraResource,
          id,
          model,
          params,
          buffer,
          headers
        );
      };
    }
  }
}


export enum SelectedType {
    Groups,
    Users,
}