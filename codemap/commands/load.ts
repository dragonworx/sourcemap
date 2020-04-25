import { Command } from '~commands';
import { Serialisable, Node } from '~core';

const localStorageKey = 'codemap:alpha';

export class LoadCommand extends Command {
   constructor (readonly nodes: Node[]) {
      super();
   }

   execute() {
      const json = localStorage[localStorageKey];
      if (!json) {
         console.log('No data found');
         return false;
      }
      // console.log(json);
      const jsonArray = JSON.parse(json);
      const nodes = jsonArray.map((nodeJSON: {}) => new Node(nodeJSON));
      this.nodes.push.apply(this.nodes, nodes);
      console.log(`${nodes.length} node(s) loaded.`)
      // abort adding to stack
      return false;
   }
}