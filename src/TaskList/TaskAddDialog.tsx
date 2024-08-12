import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

type TaskAddDialogProps = {
  show: boolean;
  date: Date;
  hour: number;
  onSave: (newName: string, date: Date, hour: number, elapsed: number) => void
  onClose: () => void
};

export const TaskAddDialog: React.FC<TaskAddDialogProps> = ({ show, date, hour, onSave, onClose }) => {

  const [newTaskName, setNewTaskName] = useState<string>("");

  const [elapsed, setElapsed] = useState<Dayjs>(dayjs().minute(0));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={show} onClose={onClose}>
        <DialogTitle>作業追加</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="作業名"
            fullWidth
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <TimePicker
            label="作業時間"
            views={['minutes']}
            format="mm"
            value={elapsed}
            onChange={(newValue) => setElapsed(newValue ?? dayjs().minute(0))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button onClick={() => {
            onSave(newTaskName, date, hour, elapsed.minute());
          }}>保存</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
