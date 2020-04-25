import { Rect, Point, Serialisable } from '~core';

const DEFAULT_FONT_SIZE = 12;
let id = 0;

export interface LineInfo {
   height: number;
   tops: number[];
}

export interface Formatting {
   fontSize: number;
   srcWidth?: number;
}

export enum NodeState {
   Creating,
   Editing,
   Dragging,
   Idle,
}

export class Node implements Serialisable {
   readonly rect: Rect = new Rect();
   readonly dragStart: Point = new Point();
   readonly dragEnd: Point = new Point();
   id: number = ++id;
   title: string = '';
   filePath: string = '';
   src: string = '';
   lineInfo: LineInfo = {
      height: 0,
      tops: [],
   };
   formatting: Formatting = {
      fontSize: DEFAULT_FONT_SIZE,
   };
   isDragging: boolean = false;
   state: NodeState = NodeState.Creating;
   preview?: string;

   constructor (json?: {}) {
      if (json) {
         const { rect, id, title, filePath, src, lineInfo, formatting, preview } = json as any;
         this.rect = new Rect();
         this.rect.init(rect.x, rect.y, rect.width, rect.height);
         this.id = id;
         this.title = title;
         this.filePath = filePath;
         this.src = src;
         this.lineInfo = lineInfo;
         this.formatting = formatting;
         this.preview = preview;
         this.state = NodeState.Idle;
      }
      this.dragStart.init(this.rect.left, this.rect.top);
      this.dragEnd.init(this.dragStart.x, this.dragStart.y);
   }

   toJSON() {
      const { rect, id, title, filePath, src, lineInfo, formatting, preview } = this;
      return {
         rect: rect.toJSON(),
         id,
         title,
         filePath,
         src,
         lineInfo,
         formatting,
         preview,
      };
   }

   static fromRect(left: number, top: number, width: number, height: number) {
      const rect = new Rect(left, top, width, height);
      return new Node(rect);
   }

   startDrag() {
      const { left, top } = this.rect;
      this.dragStart.init(left, top);
      this.isDragging = true;
   }

   endDrag() {
      const { left, top } = this.rect;
      this.dragEnd.init(left, top);
      this.isDragging = false;
   }

   dragBy(deltaX: number, deltaY: number) {
      const { rect, dragStart: { x, y} } = this;
      rect.left = x + deltaX;
      rect.top = y + deltaY;
   }
}