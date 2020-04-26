import { CommandRef, CommandCache } from './command';

export class Store<State> {
   constructor(readonly state: State, readonly undoStack: CommandCache[] = [], readonly redoStack: CommandCache[] = []) {
      console.log('Store!', state)
   }

   reducer(state: State, command: CommandRef<any>) {
      const { name: commandName, executor } = command;
      const commandCache = new CommandCache(command);
      const mutator = (object: any, key: string | null, value: any) => {
         console.log('Mutator!', object, key, value);
         commandCache.modify(object, key, value);
      };
      const currentState = this.state;
      const shouldCancel = executor(currentState, mutator);
      console.log(`Command![${commandName}]`, currentState, shouldCancel);
      if (shouldCancel === false) {
         console.log('Cancelled!')
         if (commandName === 'undo' || commandName === 'redo') {
            return {
               ...currentState,
            };
         }
         return state;
      } else {
         this.undoStack.push(commandCache);
         this.redoStack.length = 0;
         console.log(this.undoStack.length);
         return {
            ...currentState,
         };
      }
   }

   undo() {
      const commandCache = this.undoStack.pop();
      if (commandCache) {
         this.redoStack.push(commandCache);
         console.log('Undo!', commandCache.command.name);
         commandCache.undo.restore();
      }
      return false;
   }

   redo() {
      const commandCache = this.redoStack.pop();
      if (commandCache) {
         this.undoStack.push(commandCache);
         console.log('Redo!', commandCache.command.name);
         commandCache.redo.restore();
      }
      return false;
   }
}