import { initialState } from './state';
import { createStore } from './commandStore';

const state = initialState();
const { Provider, useStore } = createStore(state);

export {
   Provider,
   useStore,
}