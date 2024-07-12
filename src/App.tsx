import React, { useRef, useState } from 'react';
import TaskRecorder from './TaskRecorder';
import TaskList from './TaskList';
import { Tabs, Tab, Box, CssBaseline, useMediaQuery, Drawer, Menu, MenuItem, ButtonGroup, Button, Divider, Dialog } from '@mui/material';
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

  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);

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
          <MenuItem
          >作業記録エクスポート</MenuItem>
          <MenuItem>
            <ButtonGroup>
              <Button onClick={() => {
                setShowExportDialog(true)
              }}>CSV</Button>
              <Button onClick={() => {
                setShowExportDialog(true)
              }}>JSON</Button>
            </ButtonGroup>
          </MenuItem>
          <Divider />
          <MenuItem
          >ライトモード・ダークモード切替
          </MenuItem>
          <MenuItem>
            <ButtonGroup>
              <Button onClick={() => {
                setSelectedDisplayMode(undefined);
                setShowMenu(false);
              }}>システム</Button>
              <Button onClick={() => {
                setSelectedDisplayMode('light');
                setShowMenu(false);
              }}>ライト</Button>
              <Button onClick={() => {
                setSelectedDisplayMode('dark');
                setShowMenu(false);
              }}>ダーク</Button>
            </ButtonGroup>
          </MenuItem>
          <Divider />
          <MenuItem
          >ライセンス情報</MenuItem>
        </Menu>
      </Drawer>
      <Dialog
        open={showExportDialog}
        onClose={() => { setShowExportDialog(false) }} >
      </Dialog>
    </ThemeProvider >
  );
};

export default App;

