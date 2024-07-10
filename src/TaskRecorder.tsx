import React, { useEffect, useState } from 'react';
import { List, Divider, Typography, Button, TextField } from '@mui/material';
import { CreateLog, Service, UpdateLog, WorkLog } from './services/Service';
import TaskListItem from './TaskListItem';
import { TauriService } from './services/TauriService';

interface TaskRecorderProps {
  service: Service;
}

const TaskRecorder: React.FC<TaskRecorderProps> = ({ service = new TauriService() }) => {
  const [workName, setWorkName] = useState<string>('');
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  let isInitialized = false;

  useEffect(() => {
    if (!isInitialized) {
      const now = new Date();
      service.getWorkLogsByDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
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
    isInitialized = true;
  }, []);

  const handleStart = () => {
    const newLog: CreateLog = {
      workName: workName,
      startDate: new Date().toISOString(),
    };
    service.createWorkLog(newLog)
      .then((newNo) => {
        // 作成したレコードを workLog に埋め込んでログ一覧へ追加
        const addLog: WorkLog = {
          workNo: newNo,
          workName: newLog.workName,
          startDate: newLog.startDate,
        };
        setLogs([addLog, ...logs]);
        setWorkName('');
      })
      .catch((e: any) => setErrorMessage(e.message));
  };

  const handleEnd = (workNo: number) => {

    let targetIndex = logs.findIndex((log) => log.workNo === workNo);
    logs[targetIndex].endDate = new Date().toISOString();

    const updateLog: UpdateLog = {
      workNo: logs[targetIndex].workNo,
      workName: logs[targetIndex].workName,
      endDate: logs[targetIndex].endDate
    };

    service.updateEndDate(updateLog);
    setLogs((logs) => [...logs]);
  };

  return (
    <div>
      <Typography variant="h5">作業記録画面</Typography>
      <TextField
        label="作業名"
        value={workName}
        onChange={(e) => setWorkName(e.target.value)}
        placeholder="作業名を入力"
        fullWidth
      />
      <Button onClick={handleStart} disabled={!workName}>記録開始</Button>
      <div className="errorMessage">{errorMessage}</div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <List>
          {logs.map((log, index) => (
            <div key={log.workNo}>
              <TaskListItem
                workNo={log.workNo}
                workName={log.workName}
                startDate={log.startDate}
                endDate={log.endDate}
                onEndClicked={() => handleEnd(log.workNo)}
              >
              </TaskListItem>
              {index < logs.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </div>
    </div>
  );
};

export default TaskRecorder;

