import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState, useRef, useEffect } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import html2canvas from '~lib/html2canvas.min.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import { LineInfo, Formatting } from '~core';
import '~less/renderer.less';

export interface RendererOptions {
   formatting: Formatting;
   lineNumbers?: boolean;
   mode?: string;
   theme?: string;
};

export const defaultCodeMirrorOptions = {
   lineNumbers: true,
   mode: 'javascript',
   theme: 'monokai',
};

export const defaultRenderOptions: RendererOptions = {
   ...defaultCodeMirrorOptions,
   formatting: {
      fontSize: 12,
   }
};

export interface RenderOutput {
   canvas: HTMLCanvasElement;
   width: number;
   height: number;
   lineInfo: LineInfo;
};

export interface RendererProps {
   options: RendererOptions;
   src: string;
   onRender: (output: RenderOutput) => void;
};

export function Renderer(props: RendererProps) {
   const { src, options, onRender } = props;
   const { formatting: { srcWidth } } = options;
   const [ , setEditor ] = useState(null);
   const divElement: React.Ref<HTMLDivElement> = useRef(null);

   useEffect(() => {
     setTimeout(() => {
      const element = divElement.current!;
      const elementBounds = element.getBoundingClientRect();
      const tops: number[] = [];
      const lines = element.querySelectorAll('.CodeMirror-line');
      let lineHeight = 0;
      lines.forEach(line => {
         const presentation = line.querySelector('span[role="presentation"]')!;
         const bounds = presentation.getBoundingClientRect();
         const { top, width, height } = bounds;
         lineHeight = Math.max(lineHeight, Math.round(height));
         tops.push(Math.round(top - elementBounds.top));
      });
      if (srcWidth === undefined) {
         // remove extra white edge (html2canvas bug?)
         element.style.width = `${element.clientWidth - 1}px`;
      }
      html2canvas(element).then((canvas: HTMLCanvasElement) => onRender({
         canvas,
         width: canvas.width,
         height: canvas.height,
         lineInfo: {
            tops,
            height: lineHeight,
         },
      }));
     }, 0);
   }, []);

   const onEditorDidMount = (editor: any) => {
      editor.setValue(src);
      setEditor(editor);
   };

   return (
      <div ref={divElement}>
         <CodeMirror
            value={src}
            options={{
               ...options,
               lineWrapping: typeof srcWidth === 'number' ? true : false,
            }}
            editorDidMount={onEditorDidMount}
         />
      </div>
   );
};

export function renderSource(src: string, renderOptions: Partial<RendererOptions> = defaultRenderOptions): Promise<RenderOutput> {
   return new Promise(resolve => {
      const { formatting } = renderOptions;
      const container = document.createElement('div');
      container.classList.add('renderer');
      if (formatting && typeof formatting.srcWidth === 'number') {
         container.style.width = `${formatting.srcWidth}px`;
      }
      if (formatting && typeof formatting.fontSize === 'number') {
         container.style.fontSize = `${formatting.fontSize}px`;
      }
      document.body.appendChild(container);
      const onRender = (output: RenderOutput) => {
         container.remove();
         resolve(output);
      };
      ReactDOM.render(<Renderer src={src} options={{
         ...defaultRenderOptions,
         ...renderOptions,
      }} onRender={onRender} />, container);
   });
};