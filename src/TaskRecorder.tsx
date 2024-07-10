import React, { useState } from 'react';

const TaskRecorder: React.FC = () => {
  const [taskName, setTaskName] = useState<string>('');

  return (
    <div>
      <h2>作業記録画面</h2>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="作業名を入力"
      />
      <button>記録開始</button>
      <button>記録終了</button>
    </div>
  );
};

export default TaskRecorder;

