import { useState } from 'react';
import { ExampleScreen } from './ExampleScreen';
import { darkTheme, lightTheme, ThemeProvider } from './theme';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const switchTheme = (themeName: 'light' | 'dark') =>
    setIsDarkTheme(themeName === 'dark');

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <ExampleScreen switchTheme={switchTheme} />
    </ThemeProvider>
  );
}
