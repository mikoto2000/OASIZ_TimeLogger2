import React, { useState } from 'react';

interface Log {
  taskName: string;
  startTime: string;
  endTime: string | null;
  elapsed: number | null;
}

const TaskList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<Log[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Log | null>(null);

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

  const handleEdit = (task: Log) => {
    setEditTask(task);
    setShowDialog(true);
  };

  const handleSave = () => {
    // 編集を保存するロジックを追加
    setShowDialog(false);
  };

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.startTime);
    return logDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div>
      <h2>各日の作業一覧画面</h2>
      <button onClick={handlePrevDay}>前日</button>
      <button onClick={handleNextDay}>翌日</button>
      <div>
        <h3>{selectedDate.toLocaleDateString()}の作業一覧</h3>
        <ul>
          {filteredLogs.map((log, index) => (
            <li key={index} onClick={() => handleEdit(log)}>
              {log.taskName} - 開始: {log.startTime} - 終了: {log.endTime ? log.endTime : '進行中'} - 経過時間: {log.elapsed !== null ? `${log.elapsed} 秒` : '計算中'}
            </li>
          ))}
        </ul>
      </div>
      {showDialog && editTask && (
        <div>
          <h3>作業名編集</h3>
          <input 
            type="text" 
            value={editTask.taskName} 
            onChange={(e) => setEditTask({ ...editTask, taskName: e.target.value })} 
          />
          <button onClick={handleSave}>保存</button>
          <button onClick={() => setShowDialog(false)}>キャンセル</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;

