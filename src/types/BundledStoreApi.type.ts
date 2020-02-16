import { StoreOptions } from 'vuex';
import { StoreApi } from './StoreApi.type';

export type BundledStoreApi<O extends StoreOptions<any>> = Required<
  {
    [key in keyof StoreApi<O>]: Readonly<NonNullable<StoreApi<O>[key]>> &
      {
        [module in keyof O['modules']]: NonNullable<
          StoreApi<O['modules'][module]>[key]
        >;
      };
  }
>;
