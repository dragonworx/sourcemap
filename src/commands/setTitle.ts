import { State } from '../state';
import { Command, ObjectCachedState } from 'commandStore';

export const SetTitle = (newTitle: string): Command<State> => [
   'setTitle',
   ({ title }: State, undoCache: ObjectCachedState<any, any>[], redoCache: ObjectCachedState<any, any>[]) => {
      const value = title + newTitle;
      undoCache.push({key: 'title', value: title});
      redoCache.push({key: 'title', value});
      return {
         title: value,
      };
   }
]