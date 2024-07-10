import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 青
    },
    secondary: {
      main: '#757575', // 灰色
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#ffeb3b', // インジケーターの色（黄色）
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#ffeb3b', // 選択中のタブの文字色（黄色）
            backgroundColor: '#1976d2', // 選択中のタブの背景色（青）
          },
        },
      },
    },
  },
});


