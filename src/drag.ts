import { Point } from './point';

export class Drag {
   startMousePoint?: Point;
   startValue?: Point

   start(point: Point, value: Point) {
      this.startMousePoint = point;
      this.startValue = value;
   }

   value(currentMousePoint: Point) {
      const x = this.startValue!.x + (currentMousePoint.x - this.startMousePoint!.x);
      const y = this.startValue!.y + (currentMousePoint.y - this.startMousePoint!.y);
      return { x, y };
   }
}