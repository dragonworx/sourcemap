// import { createCommandStore } from '../src';
import createStore from '../src/createStore';

export interface Item {
   title: string;
   count: number;
};

export const initialState = () => ({
   title: 'My List',
   items: Array(5).fill(0).map((i, j) => ({
      title: `Item ${j}`,
      count: 0,
   })) as Item[],
});

export type State = ReturnType<typeof initialState>;

// const { Provider, useStore } = createCommandStore(initialState());

// export {
//    Provider as ExampleProvider,
//    useStore,
// }

export const useStore = createStore(initialState());