const I = new DOMMatrix();

class Point {
   constructor(readonly x: number, readonly y: number, readonly z: number) {

   }

   transformBy(matrix: DOMMatrix) {
      const tmp = matrix.multiply(I.translate(this.x, this.y, this.z));
      return new Point(tmp.m41, tmp.m42, tmp.m43);
   }
}

export function getTransformationMatrix(element: HTMLElement) {
   let transformationMatrix = I;
   let x = element;

   while (x != undefined && x !== x.ownerDocument!.documentElement) {
      var computedStyle = window.getComputedStyle(x, undefined);
      var transform = computedStyle.transform || "none";
      var c = transform === "none" ? I : new WebKitCSSMatrix(transform);
      transformationMatrix = c.multiply(transformationMatrix);
      x = x.parentNode as HTMLElement;
   }

   var w = element.offsetWidth;
   var h = element.offsetHeight;
   var p0 = new Point(0, 0, 0).transformBy(transformationMatrix);
   var p1 = new Point(w, 0, 0).transformBy(transformationMatrix);
   var p2 = new Point(w, h, 0).transformBy(transformationMatrix);
   var p3 = new Point(0, h, 0).transformBy(transformationMatrix);
   var left = Math.min(p0.x, p1.x, p2.x, p3.x);
   var top = Math.min(p0.y, p1.y, p2.y, p3.y);

   var rect = element.getBoundingClientRect();
   transformationMatrix = I.translate(window.pageXOffset + rect.left - left, window.pageYOffset + rect.top - top, 0).multiply(transformationMatrix);

   return transformationMatrix;
}

export function convertPointFromPageToNode(element: HTMLElement, pageX: number, pageY: number) {
   return new Point(pageX, pageY, 0).transformBy(getTransformationMatrix(element).inverse());
};

export function convertPointFromNodeToPage(element: HTMLElement, offsetX: number, offsetY: number) {
   return new Point(offsetX, offsetY, 0).transformBy(getTransformationMatrix(element));
};