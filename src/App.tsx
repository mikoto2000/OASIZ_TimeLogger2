import React, { useState } from 'react';
import TaskRecorder from './TaskRecorder';
import TaskList from './TaskList';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const App: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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
        <TaskRecorder />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TaskList />
      </TabPanel>
    </ThemeProvider>
  );
};

export default App;

