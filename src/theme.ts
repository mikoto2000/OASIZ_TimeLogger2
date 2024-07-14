import { teal } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = (mode: 'dark' | 'light') => {
  return createTheme({
    palette: {
      primary: teal,
      mode: mode,
      secondary: {
        main: '#009688',
      }
    },
  });
}
