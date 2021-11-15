import { createStore, StoreOptions } from "vuex";
import { TypedStore } from "./types/TypedStore";

class TypedVuexStoreConstructor<O extends StoreOptions<any>> {
  public store = createStore({});
  public state: O["state"];

  public constructor(options: O) {
    this.store = createStore(options);
    this.state = this.store.state || {};
    this.parseOptions(this, options, "");
  }

  /**
   * Use the provided options to construct the api.
   *
   * @param options - Typed vuex options.
   * @param prefix - Prefix of the keys in the original vuex store. Used for namespaced modules.
   */
  private parseOptions<T extends StoreOptions<any>>(
    target: Record<string, any>,
    origin: T,
    prefix = ""
  ) {
    if ("state" in origin) {
      this.createState(target, origin);
    }

    if ("getters" in origin) {
      this.createGetters(target, origin, prefix);
    }

    if ("actions" in origin) {
      this.createActions(target, origin, prefix);
    }

    if ("mutations" in origin) {
      this.createMutations(target, origin, prefix);
    }

    if ("modules" in origin) {
      for (const key in origin.modules) {
        target[key] = target[key] || {};
        this.parseOptions(
          target[key],
          origin.modules[key],
          prefix + (origin.modules[key].namespaced === false ? "" : key + "/")
        );
      }
    }
  }

  private createState<
    T extends StoreOptions<any>,
    Origin extends Record<string, any>
  >(target: T, origin: Origin) {
    target.state = origin.state;
  }

  private createMutations<
    T extends StoreOptions<any>,
    Origin extends Record<string, any>
  >(target: T, origin: Origin, prefix = "") {
    target.mutations = target.mutations || {};

    for (const key in origin.mutations) {
      target.mutations[key] = (payload?: any) =>
        this.store.commit(prefix + key, payload);
    }
  }

  private createActions<
    T extends StoreOptions<any>,
    Origin extends Record<string, any>
  >(target: T, origin: Origin, prefix = "") {
    target.actions = target.actions || {};

    for (const key in origin.actions) {
      target.actions[key] = (payload?: any) =>
        this.store.dispatch(prefix + key, payload);
    }
  }

  private createGetters<
    T extends StoreOptions<any>,
    Origin extends Record<string, any>
  >(target: T, origin: Origin, prefix = "") {
    target.getters = target.getters || {};

    for (const key in origin.getters) {
      Object.defineProperty(target.getters, key, {
        get: () => {
          const prefixedKey = prefix + key;
          return this.store.getters[prefixedKey];
        },
        enumerable: true,
        configurable: true,
      });
    }
  }
}

interface StoreApi {
  new <O extends StoreOptions<any>>(options: O): TypedStore<O> &
    TypedVuexStoreConstructor<O>;
}

export const TypedVuexStore = TypedVuexStoreConstructor as any as StoreApi;
