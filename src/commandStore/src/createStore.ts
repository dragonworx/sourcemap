import {
   useState,
   useEffect,
   Dispatch,
   SetStateAction
} from 'react';
import {
   CommandRef,
   CommandCache
} from './command';

type Dispatcher = Dispatch<SetStateAction<any>>;

interface UseStoreReturnValue<T> {
   state: T;
   dispatch: (command: CommandRef<any>) => void;
   undo: () => void;
   redo: () => void;
}

interface ObjectLiteral {
   [key: string]: any;
}

export default function createStore<T extends ObjectLiteral>(initialState: T) {
   const dispatchers = Array<Dispatcher>();
   const undoStack : CommandCache[] = [];
   const redoStack : CommandCache[] = [];

   // const state = {
   //    ...initialState
   // };

   const state = new Proxy<T>(initialState, {
      get(obj: T, key: string) {console.log('GET', key);
         return obj[key];
      },
      set(obj: T, key: string, value: any) {console.log('SET', key, value);
         (obj as any)[key] = value;
         return true;
      }
   });

   const update = () => {
      dispatchers.forEach((dispatcher) => {
         dispatcher(Date.now());
      });
   };

   const dispatch = (command: CommandRef<any>) => {
      const { name: commandName, executor } = command;
      const commandCache = new CommandCache(command);
      const cancelled = executor(commandCache, state);
      console.log(`Command![${commandName}]`, state, cancelled);
      if (cancelled === false) {
         console.log('Cancelled!')
      } else {
         undoStack.push(commandCache);
         redoStack.length = 0;
      }

      update();
   };

   const undo = () => {
      const commandCache = undoStack.pop();
      if (commandCache) {
         redoStack.push(commandCache);
         console.log('Undo!', commandCache.command.name);
         commandCache.undo.restore();
      }
      update();
   };

   const redo = () => {
      const commandCache = redoStack.pop();
      if (commandCache) {
         undoStack.push(commandCache);
         console.log('Redo!', commandCache.command.name);
         commandCache.redo.restore();
      }
      update();
   };

   const useStore = ():UseStoreReturnValue<T> => {
      const dispatcher: Dispatcher = useState()[1];

      useEffect(() => {
         dispatchers.push(dispatcher);
         return () => {
            const index = dispatchers.indexOf(dispatcher);
            dispatchers.splice(index, 1);
          };
      }, []);
      
      return {
         state,
         dispatch,
         undo,
         redo,
      };
   };

   return useStore;
}