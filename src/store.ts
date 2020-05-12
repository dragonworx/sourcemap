import createStore from 'react-lucid-store';

export const useStore = createStore('main', {
   title: 'foo'
});