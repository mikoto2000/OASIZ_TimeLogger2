import React, { useState } from 'react';
import { List, ListItem, ListItemText, Divider, Typography, Button, TextField } from '@mui/material';

interface Log {
  taskName: string;
  startTime: string;
  endTime: string | null;
  elapsed: number | null;
}

interface TaskRecorderProps {
  initialLogs?: Log[];
}

const TaskRecorder: React.FC<TaskRecorderProps> = ({ initialLogs = [] }) => {
  const [taskName, setTaskName] = useState<string>('');
  const [logs, setLogs] = useState<Log[]>(initialLogs);

  const handleStart = () => {
    const newLog: Log = {
      taskName,
      startTime: new Date().toISOString(),
      endTime: null,
      elapsed: null,
    };
    setLogs([...logs, newLog]);
    setTaskName('');
  };

  const handleEnd = (index: number) => {
    const updatedLogs = logs.map((log, i) =>
      i === index ? { ...log, endTime: new Date().toISOString(), elapsed: (new Date().getTime() - new Date(log.startTime).getTime()) / 1000 } : log
    );
    setLogs(updatedLogs);
  };

  return (
    <div>
      <Typography variant="h5">作業記録画面</Typography>
      <TextField 
        label="作業名" 
        value={taskName} 
        onChange={(e) => setTaskName(e.target.value)} 
        placeholder="作業名を入力" 
        fullWidth 
      />
      <Button onClick={handleStart} disabled={!taskName}>記録開始</Button>
      <List>
        {logs.map((log, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText
                primary={`作業名: ${log.taskName}`}
                secondary={
                  <>
                    <div>開始: {log.startTime}</div>
                    <div>終了: {log.endTime ? log.endTime : '進行中'}</div>
                    <div>経過時間: {log.elapsed !== null ? `${(log.elapsed / 60).toFixed(2)} 分` : '計算中'}</div>
                  </>
                }
              />
              {!log.endTime && <Button onClick={() => handleEnd(index)}>記録終了</Button>}
            </ListItem>
            {index < logs.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </div>
  );
};

export default TaskRecorder;

