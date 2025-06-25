import { useState } from 'react';
import { ExampleScreen } from './ExampleScreen';
import { darkTheme, lightTheme, ThemeProvider } from './theme';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const switchTheme = (themeName: 'light' | 'dark') =>
    setIsDarkTheme(themeName === 'dark');

  const extraData = {
    insets: {
      top: 50,
      bottom: 30,
      left: 0,
      right: 0,
    },
    userPreferences: {
      fontSize: 16,
      animations: true,
    },
  };

  return (
    <ThemeProvider
      theme={isDarkTheme ? darkTheme : lightTheme}
      extraData={extraData}
    >
      <ExampleScreen switchTheme={switchTheme} />
    </ThemeProvider>
  );
}
