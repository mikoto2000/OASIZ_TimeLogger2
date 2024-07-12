import React, { useState, useEffect } from 'react';
import { List, Divider, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Service, UpdateLog, WorkLog } from './services/Service';
import TaskListItem from './TaskListItem';
import { TauriService } from './services/TauriService';

import { scroller, Element } from 'react-scroll';

interface TaskListProps {
  service?: Service;
}

const TaskList: React.FC<TaskListProps> = ({ service = new TauriService() }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editTask, setEditTask] = useState<WorkLog | null>(null);

  let isInitialized = false;

  useEffect(() => {
    if (!isInitialized) {
      const now = new Date();
      fetchWorkLog(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    isInitialized = true;
  }, []);

  useEffect(() => {
    if (editTask) {
      scroller.scrollTo(editTask.workNo.toString(), {
        duration: 500,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: 0
      });
    }
  }, [logs]);

  const fetchWorkLog = (year: number, month: number, day: number) => {
    service.getWorkLogsByDate(year, month, day)
      .then((logs) => {
        const newLogs = logs.map((e: any) => {
          return {
            workNo: e.work_no,
            workName: e.work_name,
            startDate: e.start_date,
            endDate: e.end_date,
          }
        });
        setLogs(newLogs);
      })
      .catch((e: any) => setErrorMessage(e.message));
  }

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
    fetchWorkLog(prevDay.getFullYear(), prevDay.getMonth() + 1, prevDay.getDate());
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
    fetchWorkLog(nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate());
  };

  const handleEdit = (task: WorkLog) => {
    setEditTask(task);
    setShowDialog(true);
  };

  const handleSave = (task: WorkLog, newName: string) => {
    const newTask: UpdateLog = {
      workNo: task.workNo,
      workName: newName,
      endDate: task.endDate,
    };
    service.updateWorkName(newTask);
    setShowDialog(false);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  const list = (logs: WorkLog[]) => {
    if (logs.length === 0) {
      return <p>ログデータがありません。</p>
    }

    return (
      <List>
        {logs.map((log, index) => (
          <div key={index}>
            <Element name={log.workNo.toString()}>
              <TaskListItem
                workNo={log.workNo}
                workName={log.workName}
                startDate={log.startDate}
                endDate={log.endDate}
                onItemClicked={() => handleEdit(log)}
              />
            </Element>
            {index < logs.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 5.5em)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexGrow: '0' }}>
        <Typography variant="h6">
          {selectedDate.toLocaleDateString()}の作業一覧
        </Typography>
        <div>{errorMessage}</div>
      </div>
      <div style={{ flexGrow: '1', overflowY: 'auto' }}>
        {list(logs)}
      </div>
      <div style={{ flexGrow: '0'}}>
        <div style={{ display: 'flex' }}>
          <Button
            color="primary"
            variant="outlined"
            style={{ flexGrow: '1' }}
            onClick={handlePrevDay}>前日</Button>
          <Button
            color="primary"
            variant="outlined"
            style={{ flexGrow: '1' }}
            onClick={handleNextDay}>翌日</Button>
        </div>
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
          <Button onClick={(e) => {
            console.log(e);
            console.log(editTask);
            if (editTask) {
              handleSave(editTask, editTask.workName);
              const targetLog = logs.find((e) => e.workNo === editTask.workNo);
              if (targetLog) {
                targetLog.workName = editTask.workName;
                setLogs([...logs]);
              }
            }
          }}>保存</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskList;

