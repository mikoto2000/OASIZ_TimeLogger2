import React, { useState } from 'react';
import TaskRecorder from './TaskRecorder';
import TaskList from './TaskList';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('recorder');

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <header>
        <button onClick={() => navigateTo('recorder')}>作業記録</button>
        <button onClick={() => navigateTo('list')}>作業一覧</button>
      </header>
      <main>
        {currentPage === 'recorder' && <TaskRecorder />}
        {currentPage === 'list' && <TaskList />}
      </main>
    </div>
  );
};

export default App;

