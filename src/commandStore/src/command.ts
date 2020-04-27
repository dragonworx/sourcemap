import { clone, replaceArray } from './util';

export const write = (object: any, key: string | undefined, value: any) => {
   console.log(`Write![${key}]`, object, value)
   if (Array.isArray(object) && key === undefined) {
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

   modify(object: any, key?: string, value?: any) {
      this.undo.add(object, key, key === undefined ? object : object[key]);
      this.redo.add(object, key, value);
      write(object, key, value);
   }

   add<T>(array: Array<T>, item: T, index?: number) {
      this.undo.capture(array);
      if (typeof index === 'number' && index > 0) {
         array.splice(index, 0, item);
      } else {
         array.push(item);
      }
      this.redo.capture(array);
   }

   delete<T>(array: Array<T>, item: T) {
      this.undo.capture(array);
      const index = array.indexOf(item);
      array.splice(index, 1);
      this.redo.capture(array);
   }
}

export class ObjectCache {
   constructor(readonly states: ObjectCachedState[] = []) {
   }

   add(object: any, key: string | undefined, value: any) {
      const cloned = clone(value);
      this.states.push({
         object,
         key,
         value: cloned,
      });
   }

   capture(arrayOrObject: Array<any> | Object) {
      this.add(arrayOrObject, undefined, arrayOrObject);
   }

   restore() {
      this.states.forEach(({object, key, value }) => {
         write(object, key, value);
      });
   }
}

export interface ObjectCachedState {
   object: any;
   key: string | undefined;
   value: any;
}

export type Executor<T> = (
   cache: CommandCache,
   state: T,
) => boolean | void;

export type CommandRef<T> = {
   name: string;
   executor: Executor<T>;
}

export const Command = <T>(name: string, executor: Executor<T>): CommandRef<T> => ({
   name,
   executor,
})