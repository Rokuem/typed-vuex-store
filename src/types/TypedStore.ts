import { StoreOptions } from 'vuex';

type Promised<T> = T extends Promise<any> ? T : Promise<T>;

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
      ...args: infer Params
    ) => infer Result
      ? Params extends [state: any, payload: infer Payload]
      ? (payload: Payload) => Result
      : Params extends [state: any, payload?: never]
      ? () => Result
      : Params extends [state: any, payload?: infer P]
      ? (payload?: P) => Result
      : () => Result
      : never
  };
  actions: {
    [key in keyof T['actions']]: T['actions'][key] extends (
      ...args: infer Params
    ) => infer Result 
      ? Params extends [ctx: any, payload: infer Payload]
      ? (payload: Payload) => Promised<Result>
      : Params extends [ctx: any, payload?: never]
      ? () => Promised<Result> 
      : Params extends [ctx: any, payload?: infer P]
      ? (payload?: P) => Promised<Result>
      : () => Promised<Result>
      : never
  };
} & {
  [key in keyof T['modules']]: TypedStore<T['modules'][key]>;
};
