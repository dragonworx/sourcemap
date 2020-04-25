import { Command, CommandCache, ObjectCachedState } from './command';
import { replaceArray } from '../util';

export class Store<State> {
   constructor(readonly state: State, readonly undoStack: CommandCache[] = [], readonly redoStack: CommandCache[] = []) {
      console.log('Store!')
   }

   reducer(state: State, command: Command<any>) {
      const undoCache: ObjectCachedState<any, any>[] = [];
      const redoCache: ObjectCachedState<any, any>[] = [];
      const [ commandName, executor ] = command;
      const partialNewState = executor(state, undoCache, redoCache);
      console.log(JSON.stringify(commandName), state, partialNewState);
      if (partialNewState === false) {
         console.log('Cancelled!')
         if (commandName === 'undo' || commandName === 'redo') {
            return {
               ...state,
            };
         }
         return state;
      } else {
         const cache: CommandCache = {
            undo: undoCache,
            redo: redoCache,
         };
         this.undoStack.push(cache);
         this.redoStack.length = 0;
         console.log(this.undoStack.length);
         return {
            ...state,
            ...(partialNewState as Partial<State>),
         };
      }
   }

   undo(state: State) {
      console.log('Undo!');
      const cache = this.undoStack.pop();
      if (cache) {
         this.redoStack.push(cache);
         cache.undo.forEach(({key, value }) => {
            const object = (state as any)[key];
            if (Array.isArray(object) && key === '*') {
               replaceArray(object, value);
            } else {
               (state as any)[key] = value;
            }
         });
      }
      return false;
   }

   redo(state: State) {
      console.log('Redo!');
      const cache = this.redoStack.pop();
      if (cache) {
         this.undoStack.push(cache);
         cache.redo.forEach(({key, value }) => {
            const object = (state as any)[key];
            if (Array.isArray(object) && key === '*') {
               replaceArray(object, value);
            } else {
               (state as any)[key] = value;
            }
         });
      }
      return false;
   }
}