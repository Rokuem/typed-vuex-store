import { StoreOptions } from 'vuex';

export type TreeToApi<T extends StoreOptions<any>[keyof StoreOptions<any>]> = {
  [key in keyof T]: T[key] extends (...args: [any, infer A]) => any
    ? keyof A extends keyof unknown
      ? () => ReturnType<T[key]>
      : (payload: A) => ReturnType<T[key]>
    : never;
};
