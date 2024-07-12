import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";

interface WorkLogEditDialogProps {
  initialWorkName: string;
  show: boolean;
  onSave: (newName: string) => void
  onClose: () => void
}

const WorkLogEditDialog: React.FC<WorkLogEditDialogProps> = ({ initialWorkName, show, onSave, onClose }) => {

  const [newTaskName, setNewTaskName] = useState<string>(initialWorkName);

  useEffect(() => {
    setNewTaskName(initialWorkName);
  }, [initialWorkName]);

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>作業名編集</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="作業名"
          fullWidth
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={() => {
          onSave(newTaskName);
        }}>保存</Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkLogEditDialog;
