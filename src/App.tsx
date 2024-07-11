import React, { useState } from 'react';
import TaskRecorder from './TaskRecorder';
import TaskList from './TaskList';
import { AppBar, Tabs, Tab, CssBaseline, Box } from '@mui/material';
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
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexGrow: '0' }}>
          <AppBar position='static'>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="作業記録" {...a11yProps(0)} />
              <Tab label="作業一覧" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
        </div>
        <div style={{ flexGrow: '1', overflowY: 'hidden' }}>
          <Box>
            <TabPanel value={value} index={0}>
              <TaskRecorder service={service} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TaskList />
            </TabPanel>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;


