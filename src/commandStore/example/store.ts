import createStore from '../src/createStore';

export interface Item {
   title: string;
   count: number;
};

const ITEM_COUNT = 1;

export const initialState = () => ({
   title: 'My List',
   user: {
      name: 'Bob',
   },
   items: Array(ITEM_COUNT).fill(0).map((i, j) => ({
      title: `Item ${j}`,
      count: 0,
   })) as Item[],
});

export type State = ReturnType<typeof initialState>;

export const useStore = createStore(initialState(), {
   log: true
});