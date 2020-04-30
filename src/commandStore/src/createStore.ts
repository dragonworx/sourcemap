import {
   useState,
   useEffect,
   Dispatch,
   SetStateAction
} from 'react';
import {
   CommandRef,
   CommandCache,
   Mutator
} from './command';
import { Observable } from 'object-observer';

type Dispatcher = Dispatch<SetStateAction<any>>;

interface UseStoreReturnValue<T> {
   state: T;
   dispatch: (command: CommandRef<any>) => void;
   undo: () => void;
   redo: () => void;
   undoCount: number;
   redoCount: number;
}

interface ObjectLiteral {
   [key: string]: any;
}

interface DispatcherWithScope {
   dispatcher: Dispatcher;
   scope: string[];
}

export default function createStore<T extends ObjectLiteral>(initialState: T) {
   const dispatchers = Array<DispatcherWithScope>();
   const undoStack : CommandCache[] = [];
   const redoStack : CommandCache[] = [];

   const state = Observable.from({
      ...initialState
   });

   state.observe(changes => {
      changes.forEach(change => {
         console.log(change);
     });
   });

   const update = (affectedScope: string[]) => {
      dispatchers.forEach((dispatcherWithScope) => {
         affectedScope.forEach(scope => {
            if (dispatcherWithScope.scope.length === 0) return;
            dispatcherWithScope.scope.forEach(dispatcherScope => {
               if (dispatcherScope === '*' || dispatcherScope.indexOf(scope) === 0) {
                  dispatcherWithScope.dispatcher(Date.now());
               }
            });
         })
      });
   };

   const dispatch = (command: CommandRef<any>) => {
      const { name: commandName, executor } = command;
      const commandCache = new CommandCache(command);
      const mutator = new Mutator(commandCache);
      const affectedScope = executor(mutator, state); // TODO: Promise
      commandCache.affectedScope = affectedScope;
      console.log(`Command![${commandName}]`, state, affectedScope);
      if (affectedScope.length === 0) {
         console.log('No-op!')
      } else {
         undoStack.push(commandCache);
         redoStack.length = 0;
      }

      update(affectedScope);
   };

   const useStore = (...scope: string[]):UseStoreReturnValue<T> => {
      const dispatcher: Dispatcher = useState()[1];
      const dispatcherWithScope: DispatcherWithScope = {
         dispatcher,
         scope,
      };

      useEffect(() => {
         dispatchers.push(dispatcherWithScope);
         return () => {
            const index = dispatchers.findIndex(dispatcherWithScope => dispatcherWithScope.dispatcher === dispatcher);
            dispatchers.splice(index, 1);
          };
      }, []);
      
      return {
         state: state as unknown as T,
         dispatch,
         undo,
         redo,
         undoCount: undoStack.length,
         redoCount: redoStack.length,
      };
   };

   const undo = () => {
      const commandCache = undoStack.pop();
      if (commandCache) {
         redoStack.push(commandCache);
         console.log('Undo!', commandCache.command.name);
         commandCache.undo.restore();
         update(commandCache.affectedScope);
      }
   };

   const redo = () => {
      const commandCache = redoStack.pop();
      if (commandCache) {
         undoStack.push(commandCache);
         console.log('Redo!', commandCache.command.name);
         commandCache.redo.restore();
         update(commandCache.affectedScope);
      }
   };

   return useStore;
}