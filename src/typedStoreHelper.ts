import { MutationTree, ActionTree, GetterTree } from 'vuex';

/**
 * Helper to ensure the store options will have inferred types.
 */
export class TypedStoreHelper<
  S extends Record<string, any>,
  R extends Record<string, any>
> {
  constructor(state: S, rootState: R) {}

  mutations = <T extends MutationTree<S>>(mutations: T) => {
    return mutations;
  };

  actions = <T extends ActionTree<S, R>>(actions: T) => {
    return actions;
  };

  getters = <T extends GetterTree<S, R>>(getters: T) => {
    return getters;
  };
}
