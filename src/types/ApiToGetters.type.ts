import { TreeToApi } from './TreeToApi.type';

export type ApiToGetters<T extends TreeToApi<any>> = {
  [key in keyof T]: ReturnType<T[key]>;
};
