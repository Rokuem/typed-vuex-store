import {
  StoreOptions,
  Store,
  ActionTree,
  MutationTree,
  GetterTree,
  ModuleTree
} from 'vuex';
import Vue from 'vue';

type TreeToApi<T extends StoreOptions<any>[keyof StoreOptions<any>]> = {
  [key in keyof T]: T[key] extends (...args: [any, infer A]) => any
    ? A extends undefined | null | unknown
      ? () => ReturnType<T[key]>
      : (payload: A) => ReturnType<T[key]>
    : never;
};

type ApiToGetters<T extends TreeToApi<any>> = {
  [key in keyof T]: ReturnType<T[key]>;
};

type StoreApi<O extends StoreOptions<any>> = {
  state?: O['state'];
  actions?: TreeToApi<O['actions']>;
  mutations?: TreeToApi<O['mutations']>;
  getters?: ApiToGetters<TreeToApi<O['getters']>>;
  modules?: {
    [key in keyof O['modules']]: StoreApi<O['modules'][key]>;
  };
};

type typedVuexOptions<
  S extends Record<string, any> = any,
  A extends ActionTree<S, S> = any,
  M extends MutationTree<S> = any,
  G extends GetterTree<S, S> = any,
  D extends ModuleTree<S> = any
> = {
  state?: S;
  actions?: A;
  mutations?: M;
  getters?: G;
  modules?: D;
};

type BundledStoreApi<O extends StoreOptions<any>> = Required<
  {
    [key in keyof StoreApi<O>]: Readonly<NonNullable<StoreApi<O>[key]>> &
      {
        [module in keyof O['modules']]: NonNullable<
          StoreApi<O['modules'][module]>[key]
        >;
      };
  }
>;
export class TypedVuexStore<
  O extends typedVuexOptions,
  B extends BundledStoreApi<O>
> {
  public state: B['state'] = {} as any;
  public actions: B['actions'] = {} as any;
  public mutations: B['mutations'] = {} as any;
  public getters: B['getters'] = {} as any;
  private modules: {
    [key in keyof O['modules']]: StoreApi<O['modules'][key]> & {
      namespaced?: boolean;
    };
  } = {} as any;

  public constructor(public store: Store<O['state']>, options: O) {
    this.state = store.state || {};
    this.parseOptions(options);
  }

  private parseOptions<T extends typedVuexOptions>(options: T, prefix = '') {
    if ('getters' in options) {
      this.createGetters(options.getters, prefix);
    }

    if ('actions' in options) {
      this.createActions(options.actions, prefix);
    }

    if ('mutations' in options) {
      this.createMutations(options.mutations, prefix);
    }

    if ('modules' in options) {
      for (const key in options.modules) {
        this.parseOptions(
          options.modules[key],
          prefix + options.modules[key].namespaced ? key + '/' : ''
        );
      }
    }
  }

  private assignModule(
    key: keyof TypedVuexStore<O, BundledStoreApi<O>>,
    prefix: string,
    toAssign: Record<string, any>
  ) {
    let assignTarget = this[key];

    if (prefix) {
      const prefixKeys = prefix.split('/').slice(0, -1);
      assignTarget = prefixKeys.reduce((a: any, b: any) => {
        if (!a[b]) {
          a[b] = {};
        }

        return a[b];
      }, this[key]);
    }

    Object.assign(assignTarget, toAssign);
  }

  private createMutations<T extends typedVuexOptions['mutations']>(
    mutations: T,
    prefix = ''
  ) {
    const result: Partial<TreeToApi<T>> = {};

    for (const key in mutations) {
      (result as any)[key] = (payload?: any) =>
        this.store.commit(prefix + key, payload);
    }

    if (prefix) {
      const prefixKeys = prefix.split('/');
    }

    this.assignModule('mutations', prefix, result);
  }

  private createActions<T extends typedVuexOptions['actions']>(
    actions: T,
    prefix = ''
  ) {
    const result: Partial<TreeToApi<T>> = {};

    for (const key in actions) {
      (result as any)[key] = (payload?: any) =>
        this.store.dispatch(prefix + key, payload);
    }

    this.assignModule('actions', prefix, result);
  }

  private createGetters<T extends typedVuexOptions['getters']>(
    getters: T,
    prefix = ''
  ) {
    const result: Partial<TreeToApi<T>> = {};

    for (const key in getters) {
      Object.defineProperty(result, key, {
        get: () => {
          if (prefix) {
            const prefixedKey = prefix + key;
            return this.store.getters[prefixedKey];
          }
          return this.store.getters[key];
        },
        enumerable: true
      });
    }

    this.assignModule('getters', prefix, result);
  }
}
