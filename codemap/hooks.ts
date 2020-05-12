import {
  useEffect,
  useState,
  useRef,
  RefObject,
} from 'react';

export function useInterval(callback: () => void, delay: number = 1000) {
  const savedCallback = useRef<() => void>(() => void(0));

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const getHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

export function useCurrentWindow(debounceMs: number = 30) {
  let [width, setWidth] = useState(getWidth());
  let [height, setHeight] = useState(getHeight());

  useEffect(() => {
    let timeoutId: number = 0;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(getWidth());
        setHeight(getHeight());
      }, debounceMs);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  return {
    width,
    height,
  };
}

export function useDOMEvent(targetOrRef: HTMLElement | RefObject<HTMLElement>, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) {
   useEffect(() => {
      const target: HTMLElement = 'current' in targetOrRef ? (targetOrRef as RefObject<HTMLElement>).current! : targetOrRef as HTMLElement;
      target.addEventListener(type, listener, options);
      return () => {
        target.removeEventListener(type, listener, options);
      };
     }, []);
}

export function useKeyDownEvent(listener: (e: KeyboardEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'keydown', (e: Event) => {
    listener(e as KeyboardEvent);
  });
}

export function useKeyUpEvent(listener: (e: KeyboardEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'keyup', (e: Event) => {
    listener(e as KeyboardEvent);
  });
}

export function useMouseDownEvent(listener: (e: MouseEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'mousedown', (e: Event) => {
    listener(e as MouseEvent);
  });
}

export function useMouseMoveEvent(listener: (e: MouseEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'mousemove', (e: Event) => {
    listener(e as MouseEvent);
  });
}

export function useMouseUpEvent(listener: (e: MouseEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'mouseup', (e: Event) => {
    listener(e as MouseEvent);
  });
}

export const Keys = {
  Z: 90,
  C: 67,
  V: 86,
  N: 78,
  BACKSPACE: 8,
  DELETE: 46,
  SPACE: 32,
  ENTER: 13,
  ESC: 27,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  TAB: 9,
};

// export function useForceUpdate(){
//   const [, setValue] = useState(0);
//   return () => setValue(value => ++value);
// }