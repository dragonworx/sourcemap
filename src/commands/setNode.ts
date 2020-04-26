import { State } from '../store';
import { Command, Mutator } from '../commandStore';

export const SetNode = () => Command(
   'SetNode',
   (state: State, modify: Mutator) => {
      const { nodes } = state;
      const node = nodes[0];
      modify(node, 'label', (new Date).toISOString());
   }
);