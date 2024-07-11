import React, { useState } from 'react';
import TaskRecorder from './TaskRecorder';
import TaskList from './TaskList';
import { Tabs, Tab, Box, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import TabPanel, { a11yProps } from './TabPanel';
import { Service } from './services/Service';
import { TauriService } from './services/TauriService';

interface AppProps {
  service?: Service;
}

const App: React.FC<AppProps> = ({ service = new TauriService() }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [value, setValue] = useState<number>(0);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme(prefersDarkMode ? 'dark' : 'light')}>
      <CssBaseline />
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexGrow: '0' }}>
          <div>
            <Tabs value={value} indicatorColor='secondary' onChange={handleChange} variant='fullWidth'>
              <Tab label="作業記録" {...a11yProps(0)} />
              <Tab label="作業一覧" {...a11yProps(1)} />
            </Tabs>
          </div>
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


