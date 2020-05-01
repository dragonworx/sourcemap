import {
   useState,
   useEffect,
   Dispatch,
   SetStateAction
} from 'react';
import { Observable, Change } from './object-observer';

type Dispatcher = Dispatch<SetStateAction<any>>;

interface UseStoreReturnValue<T> {
   state: T;
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
   const undoStack: Change[] = [];
   const redoStack: Change[] = [];

   const state = Observable.from({
      ...initialState
   });

   (window as any).state = state;

   const getPath = (change: Change): string =>
      change.path.map(item => {
         if (typeof item === 'string') {
            return item;
         }
         return `[${item}]`;
      })
         .join('.')
         .replace(/\.\[/g, '[')
         .replace(/\.\]/g, '[');

   const debugChange = (change: Change) => JSON.stringify({
      ...change,
      object: undefined,
      pathStr: getPath(change),
   }, null, 4);

   state.observe((changes: Change[]) => {
      const affectedScopes: string[] = [];
      changes.forEach(change => {
         const { type, path, object, value, oldValue } = change;
         const key = `${path[path.length - 1]}`;
         if (type === 'delete' && key === '__bypass__') {
            return;
         }
         const pathStr = getPath(change);
         if (affectedScopes.indexOf(pathStr) === -1) {
            affectedScopes.push(pathStr);
         }
         if ('__bypass__' in change.object) {
            console.log('Detect Bypass!', debugChange(change));
            delete change.object['__bypass__'];
            return;
         }
         console.log('Observe!', debugChange(change));
         undoStack.push(change);
         redoStack.length = 0;
     });
     if (affectedScopes.length) {
      update(affectedScopes);
     }
   }, {
      enableGet: true,
   });

   const update = (affectedScopes: string[]) => {
      console.log('Update!', affectedScopes);
      dispatchers.forEach((dispatcherWithScope) => {
         affectedScopes.forEach(affectedScope => {
            if (dispatcherWithScope.scope.length === 0) return;
            dispatcherWithScope.scope.forEach(dispatcherScope => {
               if (dispatcherScope === '*' || affectedScope.indexOf(dispatcherScope) === 0) {
                  dispatcherWithScope.dispatcher(Date.now());
               }
            });
         })
      });
   };

   const useStore = (...scope: string[]): UseStoreReturnValue<T> => {
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
         undo,
         redo,
         undoCount: undoStack.length,
         redoCount: redoStack.length,
      };
   };

   const bypassObject = (object :any) => Object.defineProperty(object, '__bypass__', {
      // TODO: replace with direct call
      value: true,
      configurable: true,
   });

   const setValue = (path: (string | number)[], value: any) => {
      let ref = state as any;
      let key = path[0];
      for (let i = 0; i < path.length - 1; i++) {
         key = path[i];
         ref = ref[key];
      }
      bypassObject(ref);
      ref[path[path.length - 1]] = value;
   };

   const undo = () => {
      const change = undoStack.pop();
      if (change) {
         const { type, path, object, value, oldValue } = change;
         redoStack.push(change);
         console.log('Undo!', debugChange(change));
         const key = `${path[path.length - 1]}`;
         if (type === 'update') {
            // object[key] = oldValue;
            setValue(path, oldValue);
         } else if (type === 'delete') {
            bypassObject(object);
            if (Array.isArray(object)) {
               object.splice(parseInt(key), 0, oldValue);
            } // TODO: object and ?
         }
      }
   };

   const redo = () => {
      const change = redoStack.pop();
      if (change) {
         const { type, path, object, value, oldValue } = change;
         undoStack.push(change);
         console.log('Redo!', debugChange(change));
         const key = `${path[path.length - 1]}`;
         if (type === 'update') {
            // object[key] = value;
            setValue(path, value);
         } else if (type === 'insert' || type === 'delete') {
            if (Array.isArray(object)) {
               bypassObject(object);
               object.splice(parseInt(key), 1);
            } // TODO: object and ?
         }
      }
   };

   return useStore;
}