import createStore from '~store/store';
import { Node, View, Point } from '~core';
import { Command } from '~commands/command';
import { InteractionMode } from '~components/canvas';

interface State {
   undoStack: Array<Command>;
   redoStack: Array<Command>;
   nodes: Node[];
   selectedNodes: Node[];
   mode: InteractionMode;
   rootPath: string;
   syntax: string;
   theme: string;
   background: string;
   view: View;
   cursor: Point;
}

const state = {
   undoStack: [],
   redoStack: [],
   nodes: [],
   rootPath: '',
   syntax: 'javascript',
   theme: 'monokai',
   background: '#767474',
   selectedNodes: [],
   mode: 'select',
   view: new View(),
   cursor: new Point(20, 20),
} as State;

const useStore = createStore(state);

export default useStore;