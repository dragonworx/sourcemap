import { Command } from '~commands';
import { Node } from '~core';

const localStorageKey = 'codemap:alpha';

export class SaveCommand extends Command {
   constructor (readonly nodes: Node[]) {
      super();
   }

   execute() {
      const jsonArray = this.nodes.map(node => node.toJSON());
      const json = JSON.stringify(jsonArray, null, 4);
      localStorage[localStorageKey] = json;
      console.log(`${jsonArray.length} node(s) saved.`)
      // abort adding to stack
      return false;
   }
}