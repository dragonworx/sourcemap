import {
   useState,
   useEffect,
   Dispatch,
   SetStateAction,
   useRef,
} from 'react';
import { Observable } from './object-observer';
import log from './log';

export interface Change {
   type: 'access' | 'insert' | 'update' | 'delete' | 'shuffle' | 'reverse';
   path: Array<string | number>;
   value: any;
   oldValue: any;
   object: any;
}

export type ChangesHandler = (changes: Change[]) => void;

const newId = () => `${Math.round(Math.random() * 100000)}`;

type Dispatcher = Dispatch<SetStateAction<any>>;

interface UseStoreReturnValue<T> {
   id: string;
   state: T;
   undo: () => void;
   redo: () => void;
   undoCount: number;
   redoCount: number;
}

interface HashMap<T> {
   [key: string]: T;
}

type BitHash = HashMap<true>;

interface DispatcherWithScope {
   id: string;
   dispatcher: Dispatcher;
   scope: BitHash;
   name: string;
}

interface Options {
   log: boolean;
}

const defaultOptions: Options = {
   log: false,
};

export default function createStore<T extends HashMap<any>>(initialState: T, opts: Partial<Options> = {}) {
   const options = {
      ...defaultOptions,
      ...opts,
   };
   const dispatchers: HashMap<DispatcherWithScope> = {};
   const undoStack: Change[] = [];
   const redoStack: Change[] = [];
   const accessorIds: string[] = [];
   const peekAccessor = () => accessorIds[accessorIds.length - 1];
   if (options.log === true) {
      log.enabled = true;
   }

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

   state.observe((changes: Change[]) => {
      const changedPaths: BitHash = {};
      changes.forEach(change => {
         const { type, path, object, value, oldValue } = change;
         const key = `${path[path.length - 1]}`;
         if (type === 'delete' && key === '__bypass__') {
            return;
         }
         const pathStr = getPath(change);
         if (type === 'access') {
            log.write('get', pathStr, accessorIds);
            const id = peekAccessor();
            if (id) {
               log.write('track', id, pathStr);
               dispatchers[id].scope[pathStr] = true;
            }
            return;
         }
         changedPaths[pathStr] = true;
         if ('__bypass__' in change.object) {
            log.write('detect bypass', change);
            delete change.object['__bypass__'];
            return;
         }
         log.write('observe!', change);
         undoStack.push(change);
         redoStack.length = 0;
     });
     update(changedPaths);
   }, {
      enableGet: true
   });

   const update = (changedPaths: BitHash) => {
      log.write('update', changedPaths);
      Object.keys(dispatchers).forEach((id) => {
         const dispatcherWithScope = dispatchers[id];
         Object.keys(changedPaths).forEach(changedPath => {
            if (dispatcherWithScope.scope[changedPath]) {
               dispatcherWithScope.dispatcher(newId());
            }
         });
      });
   };

   const useStore = (name?: string): UseStoreReturnValue<T> => {
      const dispatcher: Dispatcher = useState()[1];
      const id = useRef(newId()).current;
      log.write('useStore', id, JSON.stringify(name));

      if (!dispatchers[id]) {
         const dispatcherWithScope: DispatcherWithScope = {
            id,
            dispatcher,
            scope: {},
            name: name || id,
         };
         dispatchers[id] = dispatcherWithScope;
      }

      log.write('push', id);
      accessorIds.push(id);

      useEffect(() => {
         return () => {
            delete dispatchers[id];
          };
      }, []);

      useEffect(() => {
         log.write('pop', id);
         accessorIds.pop();
      });
      
      return {
         id,
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
         log.write('undo', change);
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
         log.write('redo', change);
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