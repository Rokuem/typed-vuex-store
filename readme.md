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

NOTE: For vue 2 install the 1.1.1 version.

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

const vueApp = createApp({...});

vueApp.use(storeApi.store);
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

To help with that, you can use a the withState helper:

```typescript
import { WithState } from 'typed-vuex-store';

const { defineMutations } = withState<ModuleState, RootState /* Only needed for actions */>();

const mutations = defineMutations({
  // mutation tree...
});
```

This will make sure the mutations are ok to be used for the typed store api.

you can also do something similar for the actions and getters.

# V2 Changelog
- New WithState helper
- Vue 3 support
- Deprecated Vue 2 support