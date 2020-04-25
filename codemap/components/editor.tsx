import {
   React,
} from '~lib';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import { defaultCodeMirrorOptions } from '~components';
import '~/less/editor.less';

export interface EditorProps {
   srcWidth?: number;
   onEditorDidMount: (editor: any) => void;
   onChange: (value: string) => void;
   onAccept: () => void;
};

export function Editor(props: EditorProps) {
   const { srcWidth, onEditorDidMount, onChange, onAccept } = props;

   return (
      <div id="editor">
         <div className="editor-container">
            <CodeMirror
               options={{
                  ...defaultCodeMirrorOptions,
                  lineWrapping: typeof srcWidth === 'number' ? true : false,
                  extraKeys: {
                     'Cmd-Enter': onAccept,
                     'Ctrl-Enter': onAccept,
                  },
               }}
               editorDidMount={onEditorDidMount}
               onChange={(editor, data, value) => {
                  onChange(value);
               }}
            />
         </div>
      </div>
   );
}