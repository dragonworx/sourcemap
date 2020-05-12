import { Command } from '~commands';
import { Node, Point, NodeState } from '~core';
import { replaceArray } from '~util';

export class CreateNodeCommand extends Command {
   constructor(readonly nodes: Node[], readonly selectedNodes: Node[], readonly cursor: Point, readonly src?: string, readonly title?: string) {
      super();
   }

   execute() {
      const { nodes, selectedNodes, cursor } = this;
      const node = new Node();
      if (this.src) {
         node.src = this.src;
      }
      if (this.title) {
         node.title = this.title;
      }
      node.rect.init(cursor.x, cursor.y, 0, 0);
      this.cacheUndo(nodes, '*', nodes);
      nodes.push(node);
      replaceArray(selectedNodes, [node]);
      this.cacheRedo(nodes, '*', nodes);
   }
}