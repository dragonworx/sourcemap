import { Command } from '~commands';
import { Node } from '~core';

export class MoveNodeCommand extends Command {
   constructor (readonly selectedNodes: Node[]) {
      super();
   }

   execute() {
      const { selectedNodes } = this;
      const movedNodes = selectedNodes.filter((node: Node) => !node.rect.location.equals(node.dragStart));
      if (movedNodes.length === 0) {
         return false;
      }

      movedNodes.forEach((node: Node) => {
         const { rect } = node;
         this.cacheUndo(rect, 'left', node.dragStart.x);
         this.cacheUndo(rect, 'top', node.dragStart.y);
         this.cacheRedo(rect, 'left', node.dragEnd.x);
         this.cacheRedo(rect, 'top', node.dragEnd.y);
      });
   }
}