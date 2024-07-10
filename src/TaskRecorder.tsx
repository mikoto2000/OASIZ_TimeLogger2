import React, { useState } from 'react';
import { List, ListItem, ListItemText, Divider, Typography, Button, TextField } from '@mui/material';
import { useTauriService } from './hooks/useTauriService';
import { CreateLog, UpdateLog, WorkLog } from './services/Service';

interface TaskRecorderProps {
  initialLogs?: WorkLog[];
}

const TaskRecorder: React.FC<TaskRecorderProps> = ({ initialLogs = [] }) => {
  const [workName, setWorkName] = useState<string>('');
  const [logs, setLogs] = useState<WorkLog[]>(initialLogs);
  const [errorMessage, setErrorMessage] = useState("");

  const service = useTauriService();

  const handleStart = () => {
    const newLog: CreateLog = {
      workName: workName,
      startDate: new Date().toISOString(),
      endDate: null,
    };
    service.createWorkLog(newLog)
      .then((newNo) => {
        // 作成したレコードを workLog に埋め込んでログ一覧へ追加
        const addLog: WorkLog = {
          workNo: newNo,
          workName: newLog.workName,
          startDate: newLog.startDate,
          endDate: newLog.endDate
        };
        setLogs([addLog, ...logs]);
        setWorkName('');
      })
      .catch((e: any) => setErrorMessage(e));
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

  const getElapsed = (startDate: string, endDate?: string | null) => {
    if (!endDate) {
      return "計算中";
    }

    const sd = Date.parse(startDate);
    const ed = Date.parse(endDate);
    const elapsed = (ed - sd) / (60 * 1000);
    return elapsed.toString();
  }

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
      <List>
        {logs.map((log, index) => (
          <div key={log.workNo}>
            <ListItem>
              <ListItemText
                primary={`作業名: ${log.workName}`}
                secondary={
                  <>
                    <div>開始: {log.startDate}</div>
                    <div>終了: {log.endDate ? log.endDate : '進行中'}</div>
                    <div>経過時間: {getElapsed(log.startDate, log.endDate)} 分</div>
                  </>
                }
              />
              {!log.endDate && <Button onClick={() => handleEnd(log.workNo)}>記録終了</Button>}
            </ListItem>
            {index < logs.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </div>
  );
};

export default TaskRecorder;

