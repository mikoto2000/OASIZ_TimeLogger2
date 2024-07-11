import { teal } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: teal,
    secondary: {
      main: '#009688', // セカンダリカラーの変更
    },
    info: {
      main: '#00bfa5', // セカンダリカラーの変更
    },
  },
});

