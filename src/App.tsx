import React, { useRef, useState } from 'react';
import TaskRecorder from './TaskRecorder';
import TaskList from './TaskList';
import { Tabs, Tab, Box, CssBaseline, useMediaQuery, Drawer, Menu, MenuItem, Dialog, ButtonGroup, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import TabPanel, { a11yProps } from './TabPanel';
import { Service } from './services/Service';
import { TauriService } from './services/TauriService';

interface AppProps {
  service?: Service;
}

type DisplayMode = 'dark' | 'light';

const App: React.FC<AppProps> = ({ service = new TauriService() }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [selectedDisplayMode, setSelectedDisplayMode] = useState<DisplayMode | undefined>(undefined);

  const [tabIndex, setTabIndex] = useState<number>(0);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [showDisplayModeDialog, setShowDisplayModeDialog] = useState<boolean>(false);

  const menuIcon = useRef(null);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const calculateDisplayMode = (): DisplayMode => {
    if (selectedDisplayMode) {
      return selectedDisplayMode
    } else {
      return prefersDarkMode ? 'dark' : 'light'
    }

  }

  return (
    <ThemeProvider theme={theme(calculateDisplayMode())}>
      <CssBaseline />
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexGrow: '0' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
            <Tabs
              value={tabIndex}
              indicatorColor='secondary'
              onChange={handleChange}
              variant='fullWidth'
              style={{ flexGrow: '1' }}>
              <Tab label="作業記録" {...a11yProps(0)} />
              <Tab label="作業一覧" {...a11yProps(1)} />
            </Tabs>
            <div
              ref={menuIcon}
              style={{ flexGrow: '0' }}
              onClick={() => setShowMenu(true)}>
              <MenuIcon sx={{ fontSize: 55 }} style={{ cursor: 'pointer' }} /></div>
          </div>
        </div>
        <div style={{ flexGrow: '1', overflowY: 'hidden' }}>
          <Box>
            <TabPanel value={tabIndex} index={0}>
              <TaskRecorder service={service} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <TaskList />
            </TabPanel>
          </Box>
        </div>
      </div>
      <Drawer
        anchor='right'
        open={showMenu}
        onClose={() => setShowMenu(false)}
      >
        <Menu
          anchorEl={menuIcon.current}
          open={showMenu}
          onClose={() => setShowMenu(false)}
        >
          <MenuItem>作業記録エクスポート</MenuItem>
          <MenuItem
            onClick={() => { setShowDisplayModeDialog(true) }}
          >ライトモード・ダークモード切替</MenuItem>
          <MenuItem>ライセンス情報</MenuItem>
        </Menu>
        <Dialog
          open={showDisplayModeDialog}
          onClose={() => { setShowDisplayModeDialog(false) }} >
          <ButtonGroup>
            <Button onClick={() => {
              setSelectedDisplayMode(undefined);
              setShowDisplayModeDialog(false);
              setShowMenu(false);
            }}>システム</Button>
            <Button onClick={() => {
              setSelectedDisplayMode('light');
              setShowDisplayModeDialog(false);
              setShowMenu(false);
            }}>ライト</Button>
            <Button onClick={() => {
              setSelectedDisplayMode('dark');
              setShowDisplayModeDialog(false);
              setShowMenu(false);
            }}>ダーク</Button>
          </ButtonGroup>
        </Dialog>
      </Drawer>
    </ThemeProvider>
  );
};

export default App;


