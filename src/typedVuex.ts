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

type StoreApi<O extends StoreOptions<any>> = {
  state?: O['state'];
  actions?: TreeToApi<O['actions']>;
  mutations?: TreeToApi<O['mutations']>;
  getters?: TreeToApi<O['getters']>;
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
export class TypedVuexStore<O extends typedVuexOptions> {
  public state: O['state'] = {};
  public actions: TreeToApi<O['actions']> = {} as any;
  public mutations: TreeToApi<O['mutations']> = {} as any;
  public getters: TreeToApi<O['getters']> = {} as any;
  public modules: {
    [key in keyof O['modules']]: StoreApi<O['modules'][key]>;
  } = {} as any;

  public constructor(public store: Store<O['state']>, options: O) {
    this.state = options.state || {};
    Object.assign(this, this.parseOptions(options));

    if (options.modules) {
      for (const key in options.modules) {
        (this.modules as any)[key] = this.parseOptions(
          (this.modules as any)[key]
        );
      }
    }
  }

  private parseOptions<T extends typedVuexOptions>(options: T) {
    const result: Partial<StoreApi<T>> = {};

    if ('getters' in options) {
      result.getters = this.createGetters(options.getters);
    }

    if ('actions' in options) {
      result.actions = this.createActions(options.actions);
    }

    if ('mutations' in options) {
      result.mutations = this.createMutations(options.mutations);
    }

    return result;
  }

  private createMutations<T extends typedVuexOptions['mutations']>(
    mutations: T
  ) {
    const result: Partial<TreeToApi<T>> = {};

    for (const key in mutations) {
      (result as any)[key] = (payload?: any) => this.store.commit(key, payload);
    }

    return result as TreeToApi<T>;
  }

  private createActions<T extends typedVuexOptions['actions']>(actions: T) {
    const result: Partial<TreeToApi<T>> = {};

    for (const key in actions) {
      (result as any)[key] = (payload?: any) =>
        this.store.dispatch(key, payload);
    }

    return result as TreeToApi<O['actions']>;
  }

  private createGetters<T extends typedVuexOptions['getters']>(getters: T) {
    const result: Partial<TreeToApi<T>> = {};

    for (const key in getters) {
      Object.defineProperty(result, key, {
        get: () => {
          return this.store.getters[key];
        },
        enumerable: true
      });
    }

    return result as TreeToApi<O['getters']>;
  }
}
