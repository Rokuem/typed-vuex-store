import { ActionTree, GetterTree, MutationTree } from "vuex";

export const withState = <S, R = any>() => ({
  defineMutations: <T extends MutationTree<S>>(mutations: T) => mutations,
  defineActions: <T extends ActionTree<S, R>>(actions: T) => actions,
  defineGetters: <T extends GetterTree<S, R>>(getters: T) => getters,
});
