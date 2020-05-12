import { Point, Rect } from '~core';

export const MAX_ZOOM = 1;
export const MIN_ZOOM = 0.2;
export const DEFAULT_ZOOM = 1;

export class View {
   pan: Point;
   zoom: number;
   panStart: Point;

   constructor() {
      this.pan = new Point();
      this.zoom = DEFAULT_ZOOM;
      this.panStart = new Point();
   }

   startPan() {
      this.panStart = new Point(this.pan.x, this.pan.y);
   }

   panBy(deltaX: number, deltaY: number) {
      this.pan.x = this.panStart.x + deltaX;
      this.pan.y = this.panStart.y + deltaY;
   }

   zoomBy(delta: number/*, width: number, height: number*/) {
      const { pan: { x: panX, y: panY }, zoom: currentZoom } = this;
      let zoom = currentZoom;
      // const centerX = width / 2;
      // const centerY = height / 2;
      // const oldCenter = { x: (centerX * zoom) + panX, y: (centerY * zoom) + panY };
      zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - delta));
      // const newCenter = { x: (centerX * zoom) + panX, y: (centerY * zoom) + panY };
      // const centerDelta = { x: (oldCenter.x - newCenter.x), y: (oldCenter.y - newCenter.y) };
      this.zoom = zoom;
      // this.pan.x = this.pan.x + centerDelta.x;
      // this.pan.y = this.pan.y + centerDelta.y;
   }

   inverseZoom(value: number) {
      return value * (1 / this.zoom);
   }

   transformRect(rect: Rect) {
      const { pan: { x: panX, y: panY }, zoom } = this;
      const { left, top, right, bottom, width, height} = rect;
      return {
         left: (left * zoom) + panX,
         top: (top * zoom) + panY,
         right: (right * zoom) + panX ,
         bottom: (bottom * zoom) + panY,
         width: width * zoom,
         height: height * zoom,
      };
   }

   transformPoint(point: Point) {
      const { pan: { x: panX, y: panY }, zoom } = this;
      const { x, y } = point;
      return new Point((x * zoom) + panX, (y * zoom) + panY);
   }
}