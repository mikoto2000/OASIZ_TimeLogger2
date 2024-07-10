import React, { useState } from 'react';
import TaskRecorder from './TaskRecorder';
import TaskList from './TaskList';
import { AppBar, Tabs, Tab } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import TabPanel, { a11yProps } from './TabPanel';
import { Service } from './services/Service';
import { TauriService } from './services/TauriService';

interface AppProps {
  service?: Service;
}

const App: React.FC<AppProps> = ({ service = new TauriService() }) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="作業記録" {...a11yProps(0)} />
          <Tab label="作業一覧" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TaskRecorder service={service} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TaskList />
      </TabPanel>
    </ThemeProvider>
  );
};

export default App;


