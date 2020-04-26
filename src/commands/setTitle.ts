import { State } from '../store';
import { Command, Mutator } from '../commandStore';

export const SetTitle = (newTitle: string) => Command(
   'SetTitle',
   (state: State, modify: Mutator) => {
      const { title } = state;
      const value = title + newTitle;
      modify(state, 'title', value);
      modify(state, 'count', value.length);
   }
);