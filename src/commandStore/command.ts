import { clone, replaceArray } from '../util';

export const write = (object: any, key: string | null, value: any) => {
   console.log(`Write![${key}]`, object, value)
   if (Array.isArray(object) && key === null) {
      replaceArray(object, value);
   } else if (key) {
      object[key] = value;
   }
}

export class CommandCache {
   undo: ObjectCache = new ObjectCache();
   redo: ObjectCache = new ObjectCache()

   constructor(readonly command: CommandRef<any>) {
   }

   modify(object: any, key: string | null, value: any) {
      this.undo.add(object, key, key === null ? object : object[key]);
      this.redo.add(object, key, value);
      write(object, key, value);
   }

   write(object: any, key: string | null, value: any) {
      write(object, key, value);
   }
}

export class ObjectCache {
   constructor(readonly states: ObjectCachedState[] = []) {

   }

   add(object: any, key: string | null, value: any) {
      this.states.push({
         object,
         key,
         value: clone(value),
      });
   }

   restore() {
      this.states.forEach(({object, key, value }) => {
         write(object, key, value);
      });
   }
}

export type Mutator = (object: any, key: string | null, value: any) => void;

export interface ObjectCachedState {
   object: any;
   key: string | null;
   value: any;
}

export type Executor<T> = (
   state: T, 
   modify: Mutator,
) => boolean | void;

export type CommandRef<T> = {
   name: string;
   executor: Executor<T>;
}

export const Command = <T>(name: string, executor: Executor<T>): CommandRef<T> => ({
   name,
   executor,
})