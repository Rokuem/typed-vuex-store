import { StoreOptions } from 'vuex';
import { TreeToApi } from './TreeToApi.type';
import { ApiToGetters } from './ApiToGetters.type';

export type StoreApi<O extends StoreOptions<any>> = {
  state?: O['state'];
  actions?: TreeToApi<O['actions']>;
  mutations?: TreeToApi<O['mutations']>;
  getters?: ApiToGetters<TreeToApi<O['getters']>>;
  modules?: {
    [key in keyof O['modules']]: StoreApi<O['modules'][key]>;
  };
};
