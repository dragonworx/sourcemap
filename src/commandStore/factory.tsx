import * as React from 'react';
import {
   useReducer,
   useCallback,
   createContext,
   ReactNode,
   useContext,
   Dispatch,
} from 'react';
import { Command } from './command';
import { Store } from './store'

export interface Props {
   children: ReactNode;
}

export function createStore<T>(initialState: T) {
   const AppContext = createContext<{
      state: T;
      dispatch: Dispatch<Command<T>>;
      undo: () => void;
      redo: () => void;
   }>({
      state: initialState,
      dispatch: () => void(0),
      undo: () => void(0),
      redo: () => void(0),
   });

   const store = new Store(initialState);

   function Provider({ children }: Props) {
      const memoizedReducer = useCallback(store.reducer.bind(store), [store]);
      const [state, dispatch] = useReducer(memoizedReducer, initialState);
      const undo = () => dispatch(['undo', store.undo.bind(store)]);
      const redo = () => dispatch(['redo', store.redo.bind(store)]);
      return (
         <AppContext.Provider value={{ state, dispatch, undo, redo }}>
            {children}
         </AppContext.Provider>
      );
   }

   function useStore() {
      return useContext(AppContext);
   }

   return {
      Provider,
      useStore,
   };
}