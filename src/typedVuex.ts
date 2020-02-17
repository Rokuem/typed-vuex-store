import { Store } from 'vuex';
import Vue from 'vue';
import Vuex from 'vuex';
import { typedVuexOptions } from './types/TypedVuexOptions.type';
import { BundledStoreApi } from './types/BundledStoreApi.type';
import { StoreApi } from './types/StoreApi.type';
import { TreeToApi } from './types/TreeToApi.type';

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
  public store: Store<O['state']>;

  public constructor(options: O) {
    Vue.use(Vuex);
    this.store = new Store(options);
    this.state = this.store.state || {};
    this.parseOptions(options);
  }

  /**
   * Use the provided options to construct the api.
   *
   * @param options - Typed vuex options.
   * @param prefix - Prefix of the keys in the original vuex store. Used for namespaced modules.
   */
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

  /**
   * Assign a module key to the same api key.
   */
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
