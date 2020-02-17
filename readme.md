# About typed-vuex-store

A simple solution for vuex and typescript. Typed-vuex-store converts all the store actions, mutations, getters and modules to a object to make it typeSafe and easier to use.

## Creating the store

Provided that all the options have inferred types, all you need to do is setup the store like this:

```typescript
export const storeApi = new TypedVuexStore({
  state,
  actions,
  mutations,
  getters,
  modules: {
    moduleA
  }
});

const vueApp = new Vue({
  store: storeApi.store
  //...
});
```

Then use it like this in the app:

```typescript
storeApi.state.someModule.bob;
await storeApi.actions.doSomething(payload);
await storeApi.actions.someModule.doSomething(payload);
storeApi.mutations.doSomething(payload);
```

### Options inferred types

A problem that can happen is when using things like MutationTree, ActionTree or GetterTree, the types from the options cannot be inferred correctly. So the storeApi will not be typeSafe for it.

To help with that, you can use the TypedStoreHelper:

```typescript
const typed = new TypedStoreHelper(state, rootState);

const mutations = typed.mutations({
  // mutation tree...
});
```

This helper will make sure the mutations, actions and getters are ok to be used for the typed store api.

## How does it compare to vuex-typescript?

- JsDocs is kept when the store is converted to a typedStore API.
- No need to use this.\$store when calling mutations and actions.
- All of the API creation is automatic.

## Limitations

- No support for optional payloads for now.
- Does not register what is not provided in the options.
