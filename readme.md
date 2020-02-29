# Installation

```bash
npm i -S typed-vuex-store
```

# About typed-vuex-store

A simple solution for vuex and typescript. Typed-vuex-store converts all the store actions, mutations, getters and modules to a object to make it typeSafe and easier to use.

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
    moduleA
  }
  // other vuex store options...
});

const vueApp = new Vue({
  store: storeApi.store
  //...
});
```

Then use it like this in the app/actions/mutations:

```typescript
const someVar = storeApi.state.someModule.bob;
const someVar2 = storeApi.getters.someModule.bob;
await storeApi.actions.doSomething();
await storeApi.actions.doSomething(payload);
await storeApi.actions.someModule.doSomething(payload);
storeApi.mutations.doSomething(payload);
```

### Options inferred types

When using things like MutationTree, ActionTree or GetterTree in a `const myVar: type` format the type will not be inferred correctly.

To help with that, you can use the TypedStoreHelper:

```typescript
import { TypedStoreHelper } from 'typed-vuex-store';

const typed = new TypedStoreHelper<typeof state, typeof rootState>();

const mutations = typed.mutations({
  // mutation tree...
});
```

This helper will make sure the mutations, actions and getters are ok to be used for the typed store api.

## How does it compare to vuex-typescript?

- JsDocs is kept when the store is converted to a typedStore API.
- No need to use `this.$store` when calling mutations and actions.
- All of the API creation is automatic.
- "Go to reference" goes directly to the action/mutation/getter
