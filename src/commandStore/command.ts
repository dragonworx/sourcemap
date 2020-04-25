export interface ObjectCachedState<OT, VT> {
   key: string;
   value: VT;
}

export interface CommandCache {
   undo: ObjectCachedState<any, any>[];
   redo: ObjectCachedState<any, any>[];
}

export type Command<State> = [
   string,
   (
      state: State, 
      undoCache: ObjectCachedState<any, any>[], 
      redoCache: ObjectCachedState<any, any>[]
   ) => Partial<State> | boolean | void,
]