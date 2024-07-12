import React, { useState, useEffect } from 'react';
import { List, Divider, Typography, Button } from '@mui/material';
import { Service, WorkLog } from '../services/Service';
import { TauriService } from '../services/TauriService';
import TaskListItem from '../commons/TaskListItem';
import WorkLogEditDialog from './WorkLogEditDialog';

interface TaskListProps {
  service?: Service;
}

const TaskList: React.FC<TaskListProps> = ({ service = new TauriService() }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<WorkLog[]>([]);

  // 作業名編集ダイアログ
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

  const handleDelete = (deleteTask: WorkLog) => {
    service.deleteWorkLog(deleteTask.workNo);
    // 削除対象以外を抽出
    const newLogs = logs.filter((e) => e.workNo !== deleteTask.workNo);
    setLogs([...newLogs]);
  };

  const list = (logs: WorkLog[]) => {
    if (logs.length === 0) {
      return <p>ログデータがありません。</p>
    }

    return (
      <List>
        {logs.map((log, index) => (
          <div key={index}>
            <TaskListItem
              workNo={log.workNo}
              workName={log.workName}
              startDate={log.startDate}
              endDate={log.endDate}
              onItemClicked={() => handleEdit(log)}
              onDeleteClicked={() => handleDelete(log)}
            />
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
      <div style={{ flexGrow: '0' }}>
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
      <WorkLogEditDialog
        initialWorkName={editTask?.workName ?? ''}
        show={showDialog}
        onSave={(newTaskName: string) => {
          if (editTask) {
            const targetLog = logs.find((e) => e.workNo === editTask.workNo);
            if (targetLog) {
              targetLog.workName = newTaskName;
              service.updateWorkName(targetLog);
              setLogs([...logs]);
            }
            setShowDialog(false);
          }
        }}
        onClose={() => { setShowDialog(false) }}
      ></WorkLogEditDialog>
    </div>
  );
};

export default TaskList;

