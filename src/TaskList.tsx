import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Divider, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { WorkLog } from './services/Service';

interface TaskListProps {
  logs?: WorkLog[];
}

const TaskList: React.FC<TaskListProps> = ({ logs: initialLogs = [] }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<WorkLog[]>(initialLogs);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<WorkLog | null>(null);

  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handleEdit = (task: WorkLog) => {
    setEditTask(task);
    setShowDialog(true);
  };

  const handleSave = () => {
    // 編集を保存するロジックを追加
    setShowDialog(false);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.startDate);
    return logDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div>
      <Typography variant="h5">各日の作業一覧画面</Typography>
      <Button onClick={handlePrevDay}>前日</Button>
      <Button onClick={handleNextDay}>翌日</Button>
      <div>
        <Typography variant="h6">{selectedDate.toLocaleDateString()}の作業一覧</Typography>
        <List>
          {filteredLogs.map((log, index) => (
            <div key={index}>
              <ListItem button onClick={() => handleEdit(log)}>
                <ListItemText
                  primary={`作業名: ${log.workName}`}
                  secondary={
                    <>
                      <div>開始: {log.startDate}</div>
                      <div>終了: {log.endDate ? log.endDate : '進行中'}</div>
                      <div>経過時間(TODO): {/*log.elapsed !== null ? `${(log.elapsed / 60).toFixed(2)} 分` : '計算中'*/}</div>
                    </>
                  }
                />
              </ListItem>
              {index < filteredLogs.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </div>
      <Dialog open={showDialog} onClose={handleClose}>
        <DialogTitle>作業名編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="作業名"
            fullWidth
            value={editTask?.workName || ''}
            onChange={(e) => setEditTask(editTask ? { ...editTask, workName: e.target.value } : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskList;

