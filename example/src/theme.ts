import { createThemeFlow } from 'react-native-theme-flow';

interface ThemeContract {
  name: 'dark' | 'light';
  colors: {
    base: string;
    counter: string;
  };
}

export const { ThemeProvider, useThemeFlow, ThemeFlow, themeFactory } =
  createThemeFlow<
    ThemeContract,
    {
      insets: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      };
      userPreferences: {
        fontSize: number;
        animations: boolean;
      };
    }
  >();

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
