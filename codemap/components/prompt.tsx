import {
   React,
   useState,
   ChangeEvent,
   KeyboardEvent,
} from '~lib';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface PromptProps {
   title: string;
   description: string;
   defaultValue: string;
   label: string;
   open: boolean;
   onSave: (value: string) => void;
   onClose: () => void;
}

export function Prompt(props: PromptProps) {
   const { title, description, defaultValue, label, open, onSave, onClose } = props;
   const [ value, setValue ] = useState(defaultValue);

   const handleSubmit = () => {
      onSave(value);
      onClose();
   };

   const onChange = (e: ChangeEvent) => setValue((e.target as HTMLInputElement).value);
   const onKeyUp = (e: KeyboardEvent) => (e.keyCode === 13) && handleSubmit();

   return (
      <div>
         <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
               <DialogContentText>{description}</DialogContentText>
               <TextField
                  autoFocus
                  margin="dense"
                  label={label}
                  defaultValue={defaultValue}
                  fullWidth
                  onChange={onChange}
                  onKeyUp={onKeyUp}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={onClose} color="primary">
                  Cancel
               </Button>
               <Button onClick={handleSubmit} color="primary">
                  Save
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}