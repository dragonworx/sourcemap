import { createCommandStore } from './commandStore';

export const initialState = () => ({
   title: 'untitled',
   count: 0,
   nodes: [{label: 'nodeLabel'}]
});

export type State = ReturnType<typeof initialState>;

const { Provider, useStore } = createCommandStore(initialState());

export {
   Provider,
   useStore,
}