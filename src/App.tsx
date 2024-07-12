import React, { useEffect, useRef, useState } from 'react';
import TaskRecorder from './TaskRecord/TaskRecorder';
import TaskList from './TaskList/TaskList';
import { Tabs, Tab, Box, CssBaseline, useMediaQuery, Drawer, Menu, MenuItem, ButtonGroup, Button, Divider, Dialog, DialogContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import TabPanel, { a11yProps } from './TabPanel';
import { Service } from './services/Service';
import { TauriService } from './services/TauriService';
import { DisplayMode } from './Types';
import FileExporter, { ExportType } from './export/FileExporter';

interface AppProps {
  service?: Service;
}

const App: React.FC<AppProps> = ({ service = new TauriService() }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [currentDisplayMode, setCurrentDisplayMode] = useState<DisplayMode>('light');

  const [tabIndex, setTabIndex] = useState<number>(0);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [exportType, setExportType] = useState<ExportType>('json');
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);

  const menuIcon = useRef(null);

  useEffect(() => {
    (async () => {
      const mode = await service.getDisplayMode();
      setCurrentDisplayMode(mode);
    })();
  }, []);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };



  return (
    <ThemeProvider theme={theme(currentDisplayMode)}>
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
                setExportType('csv')
                setShowExportDialog(true)
              }}>CSV</Button>
              <Button onClick={() => {
                setExportType('json')
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
                const mode = prefersDarkMode ? 'dark' : 'light';
                service.saveDisplayMode(mode);
                setCurrentDisplayMode(mode);
                setShowMenu(false);
              }}>システム</Button>
              <Button onClick={() => {
                const mode = 'light';
                service.saveDisplayMode(mode);
                setCurrentDisplayMode(mode);
                setShowMenu(false);
              }}>ライト</Button>
              <Button onClick={() => {
                const mode = 'dark';
                service.saveDisplayMode(mode);
                setCurrentDisplayMode(mode);
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
        <DialogContent>
          <FileExporter
            exportType={exportType}
            service={service}>
          </FileExporter>
        </DialogContent>
      </Dialog>
    </ThemeProvider >
  );
};

export default App;

