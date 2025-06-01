import { createThemeFlow } from 'react-native-theme-flow';

interface ThemeContract {
  name: 'dark' | 'light';
  colors: {
    base: string;
    counter: string;
  };
}

export const { ThemeProvider, useTheme, ThemeFlow, themeFactory } =
  createThemeFlow<ThemeContract>();

export const lightTheme = themeFactory({
  name: 'light',
  colors: {
    base: 'white',
    counter: 'black',
  },
});
export const darkTheme = themeFactory({
  name: 'dark',
  colors: {
    base: 'black',
    counter: 'white',
  },
});
