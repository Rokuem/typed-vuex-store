# Installation

```bash
npm i -S typed-vuex-store
```

# About typed-vuex-store

A simple solution for vuex and typescript. Typed-vuex-store converts all the store actions, mutations, getters and modules to a object to make it typeSafe and easier to use.

# Benefits

- JsDocs is kept when the store is converted to a typedStore API.
- All of the API creation is automatic so it isn't hard to implement.
- "Go to reference" goes directly to the action/mutation/getter definition.
- Rename symbol support between store files.
- Intellisense for actions/mutations/getters.

## Creating the store

Provided that all the options have inferred types, all you need to do is setup the store like this:

```typescript
import { TypedVuexStore } from 'typed-vuex-store';

export const storeApi = new TypedVuexStore({
  state,
  actions,
  mutations,
  getters,
  modules: {
    moduleA,
  },
  // other vuex store options...
});

const vueApp = new Vue({
  store: storeApi.store,
  //...
});
```

Then use it like this in the app/actions/mutations:

```typescript
storeApi.state.bob;
storeApi.someModule.state.bob;
storeApi.someModule.getters.bob;
await storeApi.actions.doSomething();
await storeApi.actions.doSomething(payload);
await storeApi.someModule.actions.doSomething(payload);
storeApi.mutations.doSomething(payload);
storeApi.someModule.mutations.doSomething(payload);
```

### Options inferred types

When using things like MutationTree, ActionTree or GetterTree in a `const myVar: type` format the type will not be inferred correctly.

To help with that, you can use a function:

```typescript
import { MutationTree } from 'vuex';

const createMutations = <
  T extends MutationTree<typeof state, typeof rootState>
>(
  options: T
) => options;

const mutations = createMutations({
  // mutation tree...
});
```

This will make sure the mutations are ok to be used for the typed store api.

you can also do something similar for the actions and getters.

## V1 Changes

- Added tests
- Fixed namespaced modules logic.
- Fixed Promise type for actions.
- Fixed typing of submodules.
- Adjusted the `store.mutations.module.mutation` format to `store.module.mutations.mutation` to make it easier to use (same thing for state, actions and getters).
- Modules are accessed directly from the store now.

## V1.1 Changes

- Improve tests.
- Add better payload resolution.
- Fix typos in the documentation.
