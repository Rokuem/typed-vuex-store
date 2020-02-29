import { StoreOptions } from 'vuex';

export type TreeToApi<T extends StoreOptions<any>[keyof StoreOptions<any>]> = {
  [key in keyof T]: T[key] extends (...args: infer A) => any
    ? A['length'] extends 1
      ? () => ReturnType<T[key]>
      : A extends [any, infer P]
      ? (payload: P) => ReturnType<T[key]>
      : (payload?: A[1]) => ReturnType<T[key]>
    : never;
};

// ReturnType<T[key]>
