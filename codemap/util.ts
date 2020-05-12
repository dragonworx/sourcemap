export function findLast<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean) {
   let l = array.length;
   while (l--) {
       if (predicate(array[l], l, array))
           return array[l];
   }
};

export function replaceArray<T>(source: Array<T>, target: Array<T>) {
   source.length = 0;
   source.push.apply(source, target);
   return source;
}

export function removeArrayItem<T>(array: Array<T>, item: T) {
   const index = array.indexOf(item);
   array.splice(index, 1);
   return array;
}

export function isObjLiteral(obj: any) {
   let temp = obj;
   return (typeof obj !== 'object' || obj === null ?
      false :
      (
         (function () {
            while (!false) {
               if (Object.getPrototypeOf(temp = Object.getPrototypeOf(temp)) === null) {
                  break;
               }
            }
            return Object.getPrototypeOf(obj) === temp;
         })()
      )
   );
}

export function clone(value: any) {
   if (Array.isArray(value)) {
      return [...value];
   } else if (isObjLiteral(value)) {
      return {
         ...value
      };
   }
   return value;
}

export function readFile(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt: any) {
         const src = evt.target.result;
         resolve(src);
      };
      reader.onerror = function (evt) {
         reject(evt);
      };
   });
}