import { ActionTree, MutationTree, GetterTree, ModuleTree } from 'vuex';

export type typedVuexOptions<
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
