import vuex, { StoreOptions } from "vuex";
import { TypedVuexStore } from "./src/typedVuex";
import { expectTypeOf } from "expect-type";

const createOptions = <O extends StoreOptions<any>>(options: O) => options;

const storeOptions = createOptions({
  state: {
    a: 5,
    b: 8,
  },
  getters: {
    numberGetter(state: any) {
      return state.a * Math.random();
    },
    sumAB(state: any) {
      return state.a + state.b;
    },
  },
  actions: {
    callA(ctx, payload: number) {
      return "";
    },
    callB(ctx) {
      return "";
    },
    callC(ctx, payload?: number) {
      return "";
    },
    callD() {
      return "";
    },
  },
  mutations: {
    setA(state: any, payload: number) {
      state.a = payload;
    },
    setB(state: any) {
      state.a = 5;
    },
    setC(state: any, payload?: number) {
      state.a = payload;
    },
    setD() {
      console.log("a");
    },
  },
  modules: {
    module1: {
      namespaced: true,
      state: {
        a: 5,
      },
      getters: {
        ddd(_state: any, _getters: any, _rootState: any, rootGetters: any) {
          return rootGetters.asd + Math.random();
        },
      },
      modules: {
        module2: {
          namespaced: true,
          state: {
            ooo: "",
            b: 5,
          },
          mutations: {
            setB(state, payload) {
              state.b = payload;
            },
          },
        },
      },
    },
  },
});

const store = new TypedVuexStore(storeOptions);

describe("typedVuexStore", () => {
  describe("State", () => {
    test("Types should reflect the values", () => {
      expectTypeOf(store.state).toEqualTypeOf(storeOptions.state);
      expect(store.state).toEqual(storeOptions.state);

      expectTypeOf(store.module1.state).toEqualTypeOf(
        storeOptions.modules.module1.state
      );
      expect(store.module1.state).toEqual(storeOptions.modules.module1.state);

      expectTypeOf(store.module1.module2.state).toEqualTypeOf(
        storeOptions.modules.module1.modules.module2.state
      );
      expect(store.module1.module2.state).toEqual(
        (store.store.state as any).module1.module2
      );
    });
  });

  describe("Mutations", () => {
    test("Types should reflect the values", () => {
      expectTypeOf(store.mutations.setA).parameters.toEqualTypeOf([5] as [
        payload: number
      ]);
      expectTypeOf(store.mutations.setB).parameters.toEqualTypeOf([] as []);
      expectTypeOf(store.mutations.setC).parameters.toEqualTypeOf([5] as [
        payload?: number
      ]);
      expectTypeOf(store.mutations.setD).parameters.toEqualTypeOf([] as []);
    });

    test("Should affect the store correctly", () => {
      const value = 8;
      store.mutations.setA(value);
      expect(store.state.a).toBe(value);
      expect((store.store.state as any).a).toBe(value);

      store.mutations.setA(value + 1);
      expect(store.state.a).toBe(value + 1);
      expect((store.store.state as any).a).toBe(value + 1);

      store.module1.module2.mutations.setB(value);
      expect(store.module1.module2.state.b).toBe(value);
      expect((store.store.state as any).module1.module2.b).toBe(value);

      store.module1.module2.mutations.setB(value + 1);
      expect(store.module1.module2.state.b).toBe(value + 1);
      expect((store.store.state as any).module1.module2.b).toBe(value + 1);
    });
  });

  describe("Getters", () => {
    test("should have the correct type", () => {
      expectTypeOf(store.getters.numberGetter).toBeNumber();
    });

    test("Should update correctly", () => {
      expect(store.getters.sumAB).toBe(store.state.a + store.state.b);
      store.mutations.setA(100);
      expect(store.state.a).toBe(100);
      expect(store.getters.sumAB).toBe(store.state.a + store.state.b);
    });
  });

  describe("Actions", () => {
    test("Should be a promise", () => {
      expect(store.actions.callA(5)).toHaveProperty("then");
    });

    test("Should type the parameters correctly", () => {
      expectTypeOf(store.actions.callA).parameters.toEqualTypeOf([5] as [
        payload: number
      ]);
      expectTypeOf(store.actions.callB).parameters.toEqualTypeOf([] as []);
      expectTypeOf(store.actions.callC).parameters.toEqualTypeOf([5] as [
        payload?: number
      ]);
      expectTypeOf(store.actions.callD).parameters.toEqualTypeOf([] as []);
    });
  });
});
