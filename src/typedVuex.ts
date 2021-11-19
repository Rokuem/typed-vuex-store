import { createStore, StoreOptions } from "vuex";
import { TypedStore } from "./types/TypedStore";

class TypedVuexStoreConstructor<O extends StoreOptions<any>> {
  public store = createStore({});
  public state!: O["state"];

  public constructor(options: O) {
    this.store = createStore(options);
    Object.defineProperty(this, "state", {
      get() {
        return this.store.state || {};
      },
    });
    this.parseOptions(this, options, "");
  }

  /**
   * Use the provided options to construct the api.
   *
   * @param options - Typed vuex options.
   * @param prefix - Prefix of the keys in the original vuex store. Used for namespaced modules.
   */
  private parseOptions<T extends StoreOptions<any>>(
    api: Record<string, any>,
    options: T,
    prefix = ""
  ) {
    if ("state" in options) {
      this.createState(api, options, prefix);
    }

    if ("getters" in options) {
      this.createGetters(api, options, prefix);
    }

    if ("actions" in options) {
      this.createActions(api, options, prefix);
    }

    if ("mutations" in options) {
      this.createMutations(api, options, prefix);
    }

    if ("modules" in options) {
      for (const key in options.modules) {
        api[key] = api[key] || {};
        this.parseOptions(
          api[key],
          options.modules[key],
          prefix + (options.modules[key].namespaced === false ? "" : key + "/")
        );
      }
    }
  }

  private createState<
    T extends StoreOptions<any>,
    Origin extends Record<string, any>
  >(target: T, origin: Origin, prefix: string) {
    if ("state" in target) return;

    Object.defineProperty(target, "state", {
      get: () => {
        let state = this.store.state;

        if (!prefix) return state;

        const moduleKeys = prefix.split("/").filter(Boolean);

        for (const key of moduleKeys) {
          state = (state as any)[key];
        }

        return state;
      },
    });
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
