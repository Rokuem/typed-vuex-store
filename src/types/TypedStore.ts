import { StoreOptions } from 'vuex';

export type TypedStore<T extends StoreOptions<any>> = {
  state: T['state'];
  getters: {
    [key in keyof T['getters']]: T['getters'][key] extends (
      ...args: any[]
    ) => infer R
      ? R
      : never;
  };
  mutations: {
    [key in keyof T['mutations']]: T['mutations'][key] extends (
      a: any,
      b: infer P
    ) => infer R
      ? (payload: P) => R
      : T['mutations'][key] extends (a: any) => infer R
      ? () => R
      : never;
  };
  actions: {
    [key in keyof T['actions']]: T['actions'][key] extends (
      a: any,
      b: infer P
    ) => infer R
      ? R extends Promise<any>
        ? (payload: P) => R
        : (payload: P) => Promise<R>
      : T['actions'][key] extends (a: any) => infer R
      ? R extends Promise<any>
        ? () => R
        : () => Promise<R>
      : never;
  };
} & {
  [key in keyof T['modules']]: TypedStore<T['modules'][key]>;
};
